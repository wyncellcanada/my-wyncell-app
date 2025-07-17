// src/app/login/page.js
"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import Script from 'next/script'; // Use Next.js Script component
import SiteLayout from '../SiteLayout';
import { useAppContext } from '../../context/AppContext';

const LoginForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClientComponentClient();
    const { text } = useAppContext();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError(null);
        
        // Supabase will automatically handle the hCaptcha verification
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            const redirectTo = searchParams.get('redirect_to');
            router.push(redirectTo || '/');
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">{text.loginPage.welcome}</h2>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8">
                <form onSubmit={handleSignIn} className="space-y-6">
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
                            {text.loginPage.signInBtn}
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    {text.loginPage.noAccount}{' '}
                    <Link href="/signup" className="font-medium text-blue-600 hover:underline">
                        {text.loginPage.signUpLink}
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <SiteLayout>
            {/* --- INCLUDE HCAPTCHA SCRIPT HERE --- */}
            <Script src="https://js.hcaptcha.com/1/api.js" async defer />

            <div className="flex items-center justify-center py-12 bg-gray-50">
                <Suspense fallback={<div>Loading...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </SiteLayout>
    );
}
