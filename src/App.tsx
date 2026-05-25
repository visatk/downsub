import { useState } from 'react';
import { ShoppingCart, Search, Menu, ArrowRight, ShieldCheck, Truck, Zap, Star } from 'lucide-react';

// Mock data: In production, this hydrates via your Cloudflare Worker / D1 API
const FEATURED_PRODUCTS = [
  { id: 1, name: "Edge Pro Keyboard", price: 149.00, rating: 4.9, category: "Peripherals" },
  { id: 2, name: "Vite Velocity Monitor", price: 499.00, rating: 4.8, category: "Displays" },
  { id: 3, name: "Cloudflare Developer Hoodie", price: 55.00, rating: 5.0, category: "Apparel" },
  { id: 4, name: "Zero-Trust Security Key", price: 45.00, rating: 4.9, category: "Security" }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      {/* Announcement Bar */}
      <div className="bg-slate-900 text-slate-50 py-2 text-center text-xs sm:text-sm font-medium tracking-wide">
        Free global edge-routed shipping on orders over $100
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile Menu & Logo */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 -ml-2 text-slate-600 hover:text-slate-900 sm:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                aria-label="Toggle menu"
              >
                <Menu size={24} />
              </button>
              <a href="/" className="font-extrabold text-2xl tracking-tighter text-slate-900">
                CYBER<span className="text-blue-600">STORE</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex space-x-8">
              {['New Arrivals', 'Hardware', 'Apparel', 'Accessories'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                  {item}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button aria-label="Search" className="text-slate-600 hover:text-slate-900 transition-colors">
                <Search size={20} />
              </button>
              <button 
                className="relative text-slate-600 hover:text-slate-900 transition-colors"
                aria-label="Cart"
                onClick={() => setCartCount(c => c + 1)}
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-white overflow-hidden border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 sm:pt-24 sm:pb-32 lg:flex lg:items-center lg:gap-x-10">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl max-w-lg leading-tight">
                High-Performance Gear for Elite Developers.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600 max-w-xl">
                Upgrade your workstation with peripherals engineered for zero latency. Built for professionals who deploy on Fridays.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <a href="#shop" className="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 text-white px-8 py-3.5 rounded-full font-semibold text-sm transition-all shadow-sm flex items-center gap-2">
                  Shop the Collection <ArrowRight size={16} />
                </a>
                <a href="#about" className="text-sm font-semibold leading-6 text-slate-900 hover:text-blue-600 transition-colors">
                  Read our philosophy <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            
            {/* Abstract Hero Visual - Replaces heavy imagery for fast initial load */}
            <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow hidden md:block">
              <div className="w-[32rem] h-[32rem] bg-gradient-to-tr from-blue-100 to-slate-50 rounded-full flex items-center justify-center relative border border-slate-200 shadow-2xl">
                <div className="absolute inset-0 rounded-full border border-dashed border-blue-300 animate-spin-slow" style={{ animationDuration: '60s' }}></div>
                <div className="text-slate-400 font-mono text-sm">ui_placeholder_optimized.webp</div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Banners */}
        <section className="bg-slate-900 py-12 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
              <div className="flex flex-col items-center pt-8 md:pt-0">
                <Zap className="text-blue-400 mb-3" size={32} />
                <h3 className="font-semibold text-lg">Edge-Speed Fulfillment</h3>
                <p className="text-slate-400 text-sm mt-2 max-w-xs">Orders processed dynamically based on your geographic location.</p>
              </div>
              <div className="flex flex-col items-center pt-8 md:pt-0">
                <ShieldCheck className="text-blue-400 mb-3" size={32} />
                <h3 className="font-semibold text-lg">Enterprise Security</h3>
                <p className="text-slate-400 text-sm mt-2 max-w-xs">Zero-trust checkout flow. Your financial data never touches our state.</p>
              </div>
              <div className="flex flex-col items-center pt-8 md:pt-0">
                <Truck className="text-blue-400 mb-3" size={32} />
                <h3 className="font-semibold text-lg">Global Routing</h3>
                <p className="text-slate-400 text-sm mt-2 max-w-xs">Free shipping on hardware orders exceeding $100.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section id="shop" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900">Featured Hardware</h2>
                <p className="text-slate-500 mt-2">Production-ready gear for your local environment.</p>
              </div>
              <a href="/products" className="hidden sm:block text-sm font-semibold text-blue-600 hover:text-blue-800">
                View all products →
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {FEATURED_PRODUCTS.map((product) => (
                <article key={product.id} className="group relative bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square bg-slate-100 rounded-xl mb-4 overflow-hidden relative">
                    {/* Placeholder for actual image */}
                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-mono text-xs">
                      {product.category} Image
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-semibold text-blue-600 mb-1">{product.category}</p>
                      <h3 className="font-bold text-slate-900 leading-tight">
                        <a href={`/product/${product.id}`}>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {product.name}
                        </a>
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="fill-yellow-400 text-yellow-400" size={14} />
                    <span className="text-xs font-medium text-slate-600">{product.rating}</span>
                  </div>

                  <div className="flex items-center justify-between mt-4 border-t border-slate-100 pt-4">
                    <p className="text-lg font-extrabold text-slate-900">${product.price.toFixed(2)}</p>
                    {/* Z-index bump to allow clicking button over the absolute link overlay */}
                    <button 
                      className="relative z-10 bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-lg transition-colors focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                      aria-label={`Add ${product.name} to cart`}
                      onClick={(e) => {
                        e.preventDefault();
                        setCartCount(c => c + 1);
                      }}
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="mt-10 sm:hidden">
              <a href="/products" className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-900 py-3 rounded-xl font-semibold transition-colors">
                View all products
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tighter text-slate-900">CYBERSTORE</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} CyberStore. Architected for Edge compute.
          </p>
          <div className="flex space-x-6 text-sm font-medium text-slate-600">
            <a href="/privacy" className="hover:text-blue-600">Privacy</a>
            <a href="/terms" className="hover:text-blue-600">Terms</a>
            <a href="/shipping" className="hover:text-blue-600">Shipping API</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
