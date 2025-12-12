"use client";

import {useState} from "react";
import { useRouter } from "next/navigation";

export default function LoginPage(){

    // React state store user input
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // Handle Login form submission
    async function handleLogin(event){
        event.preventDefault(); // Prevent browser reload
        alert("Logging in!")
    }

return (
    <main
        className="flex flex-col items-center justify-center min-h-screen bg-gray-50"
    >
        {/* Title */}
        <h1 className="text-3x1 font-bold mb-6">Login</h1>

        {/* Login */}
        <form 
            onSubmit={handleLogin}
            className="flex flex-col gap-4 w-full max-w-sm bg-white p-8 rounded shadow"
        >
            
            {/* Email Input */}
            <input
                className="border rounded p-3 w-full"
                type = "email"
                placeholder = "Email"
                value = {email}
                onChange = {(e) => setEmail(e.target.value)} // Update react state
            />

            {/*Password Input */}
            <input
                className="border rounded p-3 w-full"
                type = "password"
                placeholder = "Password"
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
            />
            
            {/* Login Button */}
            <button className = "orange_button w-full" type="submit">
                Login
            </button>
        </form>
    </main>
    );
}
