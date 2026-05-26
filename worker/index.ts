import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sign, verify } from 'hono/jwt';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and } from 'drizzle-orm';
import * as schema from './db/schema';

// --- Types & Environment Bindings ---
type Bindings = {
  DB: D1Database;
  STORAGE: R2Bucket;
  JWT_SECRET: string;
  STRIPE_SECRET_KEY: string;
};

type Variables = {
  user: { id: string; role: string; email: string };
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// --- Middleware ---
app.use('/*', cors());

// Auth Middleware
const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = await verify(token, c.env.JWT_SECRET);
    c.set('user', decoded);
    await next();
  } catch (e) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};

// Admin Middleware
const adminMiddleware = async (c: any, next: any) => {
  const user = c.get('user');
  if (user.role !== 'admin') {
    return c.json({ error: 'Forbidden: Admins only' }, 403);
  }
  await next();
};

// --- Utilities ---
// Standard Edge-compatible SHA-256 hashing for MVP
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- Routes ---

// 1. PUBLIC: Health Check
app.get('/api/health', (c) => c.json({ status: 'ok', edge: true }));

// 2. AUTH: Register
app.post('/api/auth/register', async (c) => {
  const db = drizzle(c.env.DB);
  const { email, password } = await c.req.json();
  
  if (!email || !password) return c.json({ error: 'Missing fields' }, 400);

  const passwordHash = await hashPassword(password);
  const id = crypto.randomUUID();

  try {
    await db.insert(schema.users).values({ id, email, passwordHash, role: 'customer' });
    const token = await sign({ id, email, role: 'customer' }, c.env.JWT_SECRET);
    return c.json({ token, user: { id, email, role: 'customer' } }, 201);
  } catch (e: any) {
    return c.json({ error: 'Email already exists' }, 400);
  }
});

// 3. AUTH: Login
app.post('/api/auth/login', async (c) => {
  const db = drizzle(c.env.DB);
  const { email, password } = await c.req.json();
  
  const user = await db.select().from(schema.users).where(eq(schema.users.email, email)).get();
  const reqHash = await hashPassword(password);

  if (!user || user.passwordHash !== reqHash) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const token = await sign({ id: user.id, email: user.email, role: user.role }, c.env.JWT_SECRET);
  return c.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

// 4. PUBLIC: List Products
app.get('/api/products', async (c) => {
  const db = drizzle(c.env.DB);
  // Do not expose assetPath publicly
  const activeProducts = await db
    .select({
      id: schema.products.id,
      title: schema.products.title,
      description: schema.products.description,
      price: schema.products.price,
      imageUrl: schema.products.imageUrl,
    })
    .from(schema.products)
    .where(eq(schema.products.isActive, true));
    
  return c.json({ products: activeProducts });
});

// 5. ADMIN: Create Product
app.post('/api/products', authMiddleware, adminMiddleware, async (c) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();
  const id = crypto.randomUUID();

  await db.insert(schema.products).values({
    id,
    title: body.title,
    description: body.description,
    price: body.price,
    assetPath: body.assetPath, // Requires asset to be uploaded to R2 beforehand or simultaneously 
    imageUrl: body.imageUrl,
  });

  return c.json({ message: 'Product created successfully', id }, 201);
});

// 6. PROTECTED: Get User Purchases
app.get('/api/purchases', authMiddleware, async (c) => {
  const db = drizzle(c.env.DB);
  const user = c.get('user');

  const userPurchases = await db
    .select({
      purchaseId: schema.purchases.id,
      productId: schema.products.id,
      title: schema.products.title,
      purchasedAt: schema.purchases.purchasedAt
    })
    .from(schema.purchases)
    .innerJoin(schema.products, eq(schema.purchases.productId, schema.products.id))
    .where(eq(schema.purchases.userId, user.id));

  return c.json({ purchases: userPurchases });
});

// 7. SECURE DELIVERY: Download Digital Product from R2
app.get('/api/download/:productId', authMiddleware, async (c) => {
  const db = drizzle(c.env.DB);
  const user = c.get('user');
  const productId = c.req.param('productId');

  // Verify Ownership
  const purchase = await db
    .select()
    .from(schema.purchases)
    .where(and(eq(schema.purchases.userId, user.id), eq(schema.purchases.productId, productId)))
    .get();

  if (!purchase) {
    return c.json({ error: 'You have not purchased this product.' }, 403);
  }

  // Get Asset Path
  const product = await db.select().from(schema.products).where(eq(schema.products.id, productId)).get();
  if (!product || !product.assetPath) {
    return c.json({ error: 'Asset not found.' }, 404);
  }

  // Fetch securely from R2
  const object = await c.env.STORAGE.get(product.assetPath);
  
  if (object === null) {
    return c.json({ error: 'File missing from storage.' }, 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  // Force download behavior
  headers.set('Content-Disposition', `attachment; filename="${product.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.zip"`);

  return new Response(object.body, { headers });
});

export default app;
