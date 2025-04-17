"use client"

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
        
        const res = await axios.post("http://localhost:3000/api/chat", {
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
        <div className="text-white h-screen w-full flex items-center justify-center flex-col gap-6 p-4 bg-gray-900 pb-50">
            <div className="text-red-500">{msg}</div>

            <form onSubmit={(e) => {
                e.preventDefault(); 
                handleSubmit();
            }} className="gap-3 flex bg-gray-800 w-[60%] px-4 py-3 rounded-xl shadow-lg">

                <input type="text" ref={target} placeholder="Ask for details of any medicine..." className="flex-1 bg-transparent border-none outline-none placeholder-gray-400" disabled={count >= 3}></input>

                <button type="submit" className="text-l text-white hover:text-gray-400 ease-in-out px-4 py-2 rounded-full transition" disabled={count >= 3}>{loading ? "Processing..." : "Send"}</button>
            </form>

            <div className="m-2 container w-[60%] p-6 bg-gray-800 max-h-[60%] overflow-y-auto rounded-xl shadow-lg">
            { response ? (
                <ReactMarkdown>{response}</ReactMarkdown> 
                ) : (
                <p className="text-gray-400 text-center">Responses will appear here</p>
            )}
            </div>

            {isSignedIn && (
                <div className="text-sm text-green-400 mt-2">
                    Signed in - Enjoy unlimited searches!
                </div>
            )}
            {!isSignedIn && count < 3 && (
                <div className="text-sm text-yellow-400 mt-2">
                    {3 - count} free searches remaining
                </div>
            )}
        </div>
        </>
    )
}