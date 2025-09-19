"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function Chat(){

// get the input from user
// make a request to /api/chat
// get the response and display it 
// make it a client component

    const { isSignedIn } = useAuth();
    const target = useRef<HTMLInputElement>(null);
    const [response,setResponse] = useState("");
    const [msg, setMsg] = useState("");
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(!isSignedIn){
            const val = localStorage.getItem("count");
            setCount(val ? Number(val) : 0);
        } else {
            // reseting the trial count if the usr is signed in
            setCount(0);
        }
    }, [isSignedIn]);

    useEffect(() => {
        if( !isSignedIn && typeof count === "number") {
            localStorage.setItem("count", String(count));
        }
    },[count, isSignedIn]);

    useEffect(() => {
        if (!isSignedIn && count >= 3) {
            setMsg("Free trial expired. Login to continue...");
        } else {
            setMsg(""); // Clear the message if we're under the limit
        }
    }, [count, isSignedIn]);

    const handleSubmit = async () => {
        setLoading(true);
        if(count >= 3){
            return;
        }

        const val = target?.current?.value || "";
        
        const res = await axios.post("/api/chat", {
            userInput: val
        });

        setResponse(res.data.response);

        if(target.current) {
            target.current.value = "";
        }

        // Only increment count for non-signed in users
        if(!isSignedIn){
            setCount(count+1);
        }
        setLoading(false)
    }

return (
    <>
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
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
            {/* Subtle floating orbs */}
            <div className="absolute top-20 left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-32 right-16 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-4xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Medicine Query Assistant
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Get detailed information about any medicine with our AI-powered assistant
                    </p>
                </div>

                {/* Error Message */}
                {msg && (
                    <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-300">{msg}</span>
                        </div>
                    </div>
                )}

                {/* Search Form */}
                <div className="relative">
                    <form onSubmit={(e) => {
                        e.preventDefault(); 
                        handleSubmit();
                    }} className="relative">
                        
                        <div className="flex items-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-2 shadow-2xl hover:border-gray-600/50 transition-all duration-300 focus-within:border-gray-500/50">
                            
                            {/* Search Icon */}
                            <div className="pl-4 pr-2">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            {/* Input Field */}
                            <input 
                                type="text" 
                                ref={target} 
                                placeholder="Ask for details of any medicine..." 
                                className="flex-1 bg-transparent border-none outline-none placeholder-gray-400 text-white text-lg py-4 pr-4" 
                                disabled={count >= 3 && !isSignedIn}
                            />

                            {/* Submit Button */}
                            <button 
                                type="submit" 
                                className="bg-white hover:bg-gray-100 text-black font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2" 
                                disabled={count >= 3 && !isSignedIn}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Search</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Status Messages */}
                <div className="text-center space-y-2">
                    {isSignedIn ? (
                        <div className="inline-flex items-center space-x-2 bg-green-900/30 border border-green-500/50 rounded-full px-4 py-2 backdrop-blur-sm">
                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-green-300 text-sm font-medium">Signed in - Unlimited searches available</span>
                        </div>
                    ) : count < 3 ? (
                        <div className="inline-flex items-center space-x-2 bg-yellow-900/30 border border-yellow-500/50 rounded-full px-4 py-2 backdrop-blur-sm">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <span className="text-yellow-300 text-sm font-medium">{3 - count} free searches remaining</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center space-x-2 bg-red-900/30 border border-red-500/50 rounded-full px-4 py-2 backdrop-blur-sm">
                            <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-300 text-sm font-medium">Free searches exhausted - Please sign in</span>
                        </div>
                    )}
                </div>

                {/* Response Container */}
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="bg-gray-700/30 border-b border-gray-600/50 px-6 py-4">
                        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Response</span>
                        </h3>
                    </div>
                    
                    <div className="p-6 max-h-96 overflow-y-auto custom-scrollbar">
                        {response ? (
                            <div className="prose prose-invert max-w-none">
                                <ReactMarkdown>{response}</ReactMarkdown>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <p className="text-gray-400 text-lg">Ready to help you with medicine information</p>
                                <p className="text-gray-500 text-sm mt-2">Type your question above and press search</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    </div>

    <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(55, 65, 81, 0.3);
            border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.5);
            border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 163, 175, 0.7);
        }

        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
            color: white;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        
        .prose p {
            margin-bottom: 1em;
            line-height: 1.6;
        }
        
        .prose ul, .prose ol {
            margin: 1em 0;
            padding-left: 1.5em;
        }
        
        .prose li {
            margin: 0.5em 0;
        }
        
        .prose strong {
            color: white;
            font-weight: 600;
        }
        
        .prose code {
            background-color: rgba(55, 65, 81, 0.5);
            padding: 0.125em 0.25em;
            border-radius: 0.25em;
            font-size: 0.875em;
        }
    `}</style>
    </>
)
}