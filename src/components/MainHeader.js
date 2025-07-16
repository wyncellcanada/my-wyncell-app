// src/components/MainHeader.js
"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAppContext } from '../context/AppContext';

// --- Reusable Icons ---
const HomeIcon = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" /></svg>;
const BusinessIcon = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" /></svg>;
const GlobalIcon = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1h-2v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>;
const ShoppingCartIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const LanguageIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 01-9-9 9 9 0 019-9m9 9a9 9 0 01-9 9m9-9H3m9 9a9 9 0 009-9M3 12a9 9 0 019-9m-9 9h18" /></svg>;
const MenuIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>;
const CloseIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;


const MobileMenu = ({ isOpen, onClose, productOptions, activeProduct, text, setLanguage, user, handleSignOut }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/80 z-50 animate-fade-in md:hidden">
            <div className="absolute top-0 right-0 h-full w-full max-w-xs bg-gray-900 shadow-lg p-6">
                <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-white"><CloseIcon className="w-8 h-8" /></button>
                <nav className="mt-16 flex flex-col space-y-6">
                    {productOptions.map(opt => (
                        <Link key={opt.id} href={opt.href} onClick={onClose} className={`px-4 py-3 font-semibold text-xl rounded-lg transition-all duration-300 flex items-center gap-3 ${activeProduct === opt.id ? 'bg-white text-gray-900' : 'text-gray-300 hover:bg-gray-800'}`}>
                            <opt.icon className="w-6 h-6" />{opt.label}
                        </Link>
                    ))}
                </nav>
                <div className="mt-8 border-t border-gray-700 pt-6 flex flex-col space-y-4">
                    {user ? (
                        <>
                            <Link href="/dashboard" onClick={onClose} className="text-lg font-semibold text-gray-300 hover:text-white">My Account</Link>
                            <button onClick={handleSignOut} className="text-left text-lg font-semibold text-gray-300 hover:text-white">Sign Out</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" onClick={onClose} className="text-lg font-semibold text-gray-300 hover:text-white">{text.login || "Login"}</Link>
                            <Link href="/signup" onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold text-center">{text.signUp || "Sign Up"}</Link>
                        </>
                    )}
                </div>
                <div className="mt-8 border-t border-gray-700 pt-6">
                    <h3 className="text-gray-400 font-semibold mb-3">Language</h3>
                    <div className="flex flex-col items-start space-y-2">
                        <a href="#" onClick={(e) => { e.preventDefault(); setLanguage('en'); onClose(); }} className="text-lg text-gray-300 hover:text-white">English</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); setLanguage('fr'); onClose(); }} className="text-lg text-gray-300 hover:text-white">Français</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); setLanguage('sp'); onClose(); }} className="text-lg text-gray-300 hover:text-white">Español</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function MainHeader() {
    const { language, setLanguage, text } = useAppContext();
    const supabase = createClientComponentClient();
    const pathname = usePathname();

    const [user, setUser] = useState(null);
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setIsMobileMenuOpen(false);
    };

    const getActiveProduct = () => {
        if (pathname.startsWith('/esims')) return 'global';
        if (pathname.startsWith('/business')) return 'business';
        return 'home';
    };
    const activeProduct = getActiveProduct();

    const productOptions = [
        { id: 'home', label: "Home", icon: HomeIcon, href: '/' },
        { id: 'business', label: "Business", icon: BusinessIcon, href: '/business' },
        { id: 'global', label: 'Global eSIM', icon: GlobalIcon, href: '/esims' },
    ];

    return (
        <>
            <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-lg text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <Link href="/" className="flex items-center">
                            <Image src="/logo.png" alt="Wyncell Logo" width={140} height={40} priority />
                        </Link>
                        <nav className="hidden md:flex items-center space-x-2 bg-gray-800/50 p-1 rounded-full">
                            {productOptions.map(opt => (
                                <Link key={opt.id} href={opt.href}
                                    className={`px-4 py-2 font-semibold text-lg rounded-full transition-all duration-300 flex items-center gap-2 ${activeProduct === opt.id ? 'bg-white text-gray-900 shadow-md' : 'text-gray-300 hover:text-white'}`}>
                                    <opt.icon className="w-5 h-5" />
                                    {opt.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="hidden md:flex items-center space-x-4">
                            {user ? (
                                <>
                                    <Link href="/dashboard" className="font-semibold hover:text-gray-300 transition-colors">My Account</Link>
                                    <button onClick={handleSignOut} className="font-semibold hover:text-gray-300 transition-colors">Sign Out</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="font-semibold hover:text-gray-300 transition-colors">{text.login || "Login"}</Link>
                                    <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition duration-300 transform hover:scale-105">{text.signUp || "Sign Up"}</Link>
                                </>
                            )}
                            <button className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                                <ShoppingCartIcon className="w-6 h-6" />
                            </button>
                            <div className="relative">
                                <button onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)} className="p-2 rounded-full hover:bg-gray-700 transition-colors flex items-center gap-1">
                                    <LanguageIcon className="w-6 h-6" />
                                </button>
                                {isLangDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl py-1 text-gray-800 animate-fade-in-down">
                                        <a href="#" onClick={(e) => { e.preventDefault(); setLanguage('en'); setIsLangDropdownOpen(false); }} className="block px-4 py-2 text-sm hover:bg-gray-100">English</a>
                                        <a href="#" onClick={(e) => { e.preventDefault(); setLanguage('fr'); setIsLangDropdownOpen(false); }} className="block px-4 py-2 text-sm hover:bg-gray-100">Français</a>
                                        <a href="#" onClick={(e) => { e.preventDefault(); setLanguage('sp'); setIsLangDropdownOpen(false); }} className="block px-4 py-2 text-sm hover:bg-gray-100">Español</a>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="md:hidden">
                            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-300 hover:text-white">
                                <MenuIcon className="w-8 h-8" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                productOptions={productOptions}
                activeProduct={activeProduct}
                text={text}
                setLanguage={setLanguage}
                user={user}
                handleSignOut={handleSignOut}
            />
        </>
    );
}
