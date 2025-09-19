"use client";

import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-black">
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px'
              }}
            />
          </div>
          
          {/* Subtle Orbs */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gray-600/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-gray-500/10 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gray-400/10 rounded-full blur-xl animate-pulse delay-2000" />
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gray-500/10 rounded-full blur-xl animate-pulse delay-500" />
        </div>

        {/* Main Hero Section */}
        <div
          className="relative z-10 min-h-screen w-full flex items-center flex-col justify-center font-[Poppins] px-4"
          style={{ minHeight: "calc(100vh - 4rem)" }}
        >


          {/* Main Content */}
          <div className="relative z-20 text-center max-w-6xl mx-auto">
            <h1 className="scroll-m-20 mb-6 text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Unlocking the potential of
              <span className="block text-gray-100">
                technology
              </span>
            </h1>

            <div className="relative mb-12">
              <p className="text-gray-400 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed px-6 relative z-10">
                AI-powered pharmaceutical solutions to streamline your workflow and
                <span className="text-gray-200 font-medium"> enhance patient care</span>
              </p>
              
              {/* Subtle glow effect behind text */}
              <div className="absolute inset-0 bg-white/5 blur-xl rounded-full" />
            </div>

            <div className="relative group">
              <Link href="/query">
                <span className="relative inline-block bg-white hover:bg-gray-100 text-black font-bold py-4 px-10 rounded-xl shadow-2xl transform transition duration-300 hover:scale-105">
                  <span className="text-lg font-extrabold tracking-wide">
                    Get Started
                  </span>
                  
                  {/* Arrow Icon */}
                  <svg className="inline-block ml-2 w-5 h-5 text-black transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4 justify-center mt-12 px-4">
              {['AI-Powered', 'Real-time Analytics', 'Cloud-Based', 'Secure'].map((feature, index) => (
                <div 
                  key={feature}
                  className="px-6 py-2 rounded-full border border-gray-700 bg-gray-800/50 backdrop-blur-sm text-gray-300 text-sm hover:border-gray-600 hover:text-white transition-all duration-300 cursor-default"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          
        </div>

        {/* Cards Section with Enhanced Background */}
        
      </div>

      <style jsx>{`        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </>
  );
}