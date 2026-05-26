
export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-5 flex justify-between items-center">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
          CyberCoderBD
        </div>
        <a 
          href="https://cybercoderbd.com/" 
          target="_blank" 
          rel="noreferrer" 
          className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
        >
          অফিসিয়াল ওয়েবসাইট →
        </a>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-24 pb-12 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-semibold mb-8 animate-pulse">
          🚀 বাংলাদেশের অন্যতম সেরা টেক ও সাইবার সিকিউরিটি কমিউনিটি
        </div>
        
        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          কোডিং এবং সাইবার সিকিউরিটি <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
            এখন শিখুন একসাথে
          </span>
        </h1>
        
        {/* Subheadline (Copywriting) */}
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          CyberCoderBD টেলিগ্রাম চ্যানেলে যুক্ত হোন। নিয়মিত টেক আপডেট, কোডিং রিসোর্স, গাইডলাইন এবং হ্যাকিং টিউটোরিয়াল পান সবার আগে, সম্পূর্ণ ফ্রিতে।
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <a
            href="https://t.me/CyberCoderBD"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] transform hover:-translate-y-1"
          >
            {/* Telegram Icon */}
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            টেলিগ্রামে জয়েন করুন
          </a>
          <a
            href="https://cybercoderbd.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-gray-700 hover:border-gray-500"
          >
            ওয়েবসাইট ভিজিট করুন
          </a>
        </div>
        
        {/* Trust Indicators / Features */}
        <div className="mt-20 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row items-center justify-center gap-8 text-gray-400 text-sm font-medium w-full">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            নিয়মিত প্রিমিয়াম রিসোর্স
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            সক্রিয় ডেভেলপার কমিউনিটি
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            হেল্পিং ও গাইডলাইন সাপোর্ট
          </div>
        </div>
      </main>
    </div>
  );
}
