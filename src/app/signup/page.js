// src/app/signup/page.js
"use client";

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import Script from 'next/script'; // Use Next.js Script component for external scripts
import SiteLayout from '../SiteLayout';
import { useAppContext } from '../../context/AppContext';

const SignUpForm = () => {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const { text } = useAppContext();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null);

        // Supabase's signUp function will automatically look for the hCaptcha token
        // because you enabled it in the dashboard.
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // This is where the hCaptcha token is automatically included
                // You don't need to add any extra code here for it to work.
            },
        });

        if (error) {
            setError(error.message);
        } else {
            // Redirect to a confirmation page or the main page
            router.push('/');
            alert('Success! Please check your email to confirm your account.');
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">Create an Account</h2>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8">
                <form onSubmit={handleSignUp} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">{text.loginPage.emailLabel}</label>
                        <input
                            id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">{text.loginPage.passwordLabel}</label>
                        <input
                            id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    {/* --- HCAPTCHA WIDGET WITH YOUR SITEKEY --- */}
                    <div 
                        className="h-captcha" 
                        data-sitekey="8ac6bb1a-763c-4c6a-ae28-466cb7b6e436" // The sitekey has been updated to the correct one.
                    ></div>

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    
                    <div>
                        <button type="submit" className="w-full font-semibold py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            {text.loginPage.signUpLink}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function SignUpPage() {
    return (
        <SiteLayout>
            {/* --- INCLUDE HCAPTCHA SCRIPT HERE --- */}
            <Script src="https://js.hcaptcha.com/1/api.js" async defer />

            <div className="flex items-center justify-center py-12 bg-gray-50">
                <Suspense fallback={<div>Loading...</div>}>
                    <SignUpForm />
                </Suspense>
            </div>
        </SiteLayout>
    );
}
