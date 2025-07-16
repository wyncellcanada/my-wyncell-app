"use client";
import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAppContext } from '../context/AppContext';

// --- SVG Icons ---
const HomeIcon = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" /></svg>;
const BusinessIcon = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" /></svg>;
const CheckIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>;
const ChevronDownIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>;
const SocialIcon = ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">{children}</a>;
const CloseIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;

// --- Data for the page content ---
const pageData = {
    home: {
        en: {
            hero: { title: "Fast, Reliable Internet for Your Home", description: "Experience seamless streaming, gaming, and browsing with Wyncell's high-speed home internet plans.", image: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=2070&auto=format&fit=crop" },
            plans: [
                { name: "Starter 30", price: "34.95", speed: "30 Mbps", features: ["Ideal for browsing & email", "Unlimited Data", "Free Modem Rental"], popular: false },
                { name: "Everyday 60", price: "49.95", speed: "60 Mbps", features: ["Great for small families & HD streaming", "Unlimited Data", "24/7 Support"], popular: false },
                { name: "Power 120", price: "64.95", speed: "120 Mbps", features: ["Perfect for gaming & multiple devices", "Unlimited Data", "24/7 Support"], popular: true },
                { name: "Pro 400", price: "79.95", speed: "400 Mbps", features: ["For power users & 4K streaming", "Unlimited Data", "Priority Support"], popular: false },
            ],
            features: [
                { title: "No Price Hikes", description: "Your rate is locked in. We believe in fair, transparent pricing without surprises." },
                { title: "No Contracts", description: "Enjoy the freedom of a month-to-month service with no long-term commitments." },
                { title: "Canadian Support", description: "Our friendly, expert support team is based right here in Canada, ready to help." },
            ],
            faqs: [
                { q: "How does Wyncell compare to other providers?", a: "Wyncell offers comparable speeds to major providers but at more affordable prices, without long-term contracts or hidden fees." },
                { q: "What equipment do I need for home internet?", a: "We provide a free modem with all our plans. You can use your own router or purchase one from us." },
            ]
        },
        fr: {
            hero: { title: "Internet Rapide et Fiable pour Votre Maison", description: "Vivez une expérience de streaming, de jeu et de navigation fluide avec les forfaits internet haute vitesse de Wyncell.", image: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=2070&auto=format&fit=crop" },
            plans: [
                { name: "Débutant 30", price: "34.95", speed: "30 Mbps", features: ["Idéal pour la navigation et les e-mails", "Données illimitées", "Modem en location gratuit"], popular: false },
                { name: "Quotidien 60", price: "49.95", speed: "60 Mbps", features: ["Parfait pour les petites familles et le streaming HD", "Données illimitées", "Soutien 24/7"], popular: false },
                { name: "Puissance 120", price: "64.95", speed: "120 Mbps", features: ["Idéal pour le jeu et plusieurs appareils", "Données illimitées", "Soutien 24/7"], popular: true },
                { name: "Pro 400", price: "79.95", speed: "400 Mbps", features: ["Pour les utilisateurs intensifs et le streaming 4K", "Données illimitées", "Support prioritaire"], popular: false },
            ],
             features: [
                { title: "Aucune Hausse de Prix", description: "Votre tarif est garanti. Nous croyons en une tarification juste et transparente, sans surprises." },
                { title: "Aucun Contrat", description: "Profitez de la liberté d'un service mensuel sans engagements à long terme." },
                { title: "Soutien Canadien", description: "Notre équipe de soutien amicale et experte est basée ici même, au Canada." },
            ],
            faqs: [
                { q: "Comment Wyncell se compare-t-il aux autres fournisseurs ?", a: "Wyncell offre des vitesses comparables aux grands fournisseurs mais à des prix plus abordables, sans contrats à long terme ni frais cachés." },
                { q: "De quel équipement ai-je besoin pour l'internet à domicile ?", a: "Nous fournissons un modem gratuit avec tous nos forfaits. Vous pouvez utiliser votre propre routeur ou en acheter un chez nous." },
            ]
        },
        sp: {
            hero: { title: "Internet Rápido y Confiable para tu Hogar", description: "Disfruta de streaming, juegos y navegación sin interrupciones con los planes de internet de alta velocidad de Wyncell.", image: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=2070&auto=format&fit=crop" },
            plans: [
                { name: "Básico 30", price: "34.95", speed: "30 Mbps", features: ["Ideal para navegar y correo electrónico", "Datos Ilimitados", "Módem en alquiler gratis"], popular: false },
                { name: "Diario 60", price: "49.95", speed: "60 Mbps", features: ["Ideal para familias pequeñas y streaming HD", "Datos Ilimitados", "Soporte 24/7"], popular: false },
                { name: "Potencia 120", price: "64.95", speed: "120 Mbps", features: ["Perfecto para juegos y múltiples dispositivos", "Datos Ilimitados", "Soporte 24/7"], popular: true },
                { name: "Pro 400", price: "79.95", speed: "400 Mbps", features: ["Para usuarios avanzados y streaming 4K", "Datos Ilimitados", "Soporte prioritario"], popular: false },
            ],
             features: [
                { title: "Sin Aumentos de Precio", description: "Tu tarifa está garantizada. Creemos en precios justos y transparentes, sin sorpresas." },
                { title: "Sin Contratos", description: "Disfruta de la libertad de un servicio de mes a mes sin compromisos a largo plazo." },
                { title: "Soporte Canadiense", description: "Nuestro amable y experto equipo de soporte tiene su sede aquí mismo, en Canadá." },
            ],
            faqs: [
                { q: "¿Cómo se compara Wyncell con otros proveedores?", a: "Wyncell ofrece velocidades comparables a los principales proveedores pero a precios más asequibles, sin contratos a largo plazo ni tarifas ocultas." },
                { q: "¿Qué equipo necesito para el internet en casa?", a: "Proporcionamos un módem gratuito con todos nuestros planes. Puedes usar tu propio router o comprarnos uno." },
            ]
        }
    },
};

// --- Modal Components ---
const AvailabilityModal = ({ isOpen, onClose, onAvailable, text }) => {
    const [postalCode, setPostalCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const handleCheck = (e) => { e.preventDefault(); setError(''); const regex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/; if (!regex.test(postalCode)) { setError('Please enter a valid Canadian postal code.'); return; } setIsLoading(true); setTimeout(() => { setIsLoading(false); onAvailable(); }, 1500); };
    if (!isOpen) return null;
    return (<div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"><div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative transform animate-fade-in-up"><button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"><CloseIcon className="w-6 h-6" /></button><h2 className="text-3xl font-bold text-center mb-2">{text.availabilityModalTitle}</h2><p className="text-gray-500 text-center mb-8">{text.availabilityModalDesc}</p><form onSubmit={handleCheck}><div><label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">{text.postalCodeLabel}</label><input type="text" id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value.toUpperCase())} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="A1A 1A1" />{error && <p className="text-red-500 text-sm mt-1">{error}</p>}</div><div className="mt-8"><button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100">{isLoading ? text.checkingBtn : text.checkAvailabilityBtn}</button></div></form></div></div>);
};
const SignUpModal = ({ isOpen, onClose, text }) => {
    if (!isOpen) return null;
    return (<div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"><div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative transform animate-fade-in-up"><button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"><CloseIcon className="w-6 h-6" /></button><h2 className="text-3xl font-bold text-center mb-2">{text.signUpModalTitle}</h2><p className="text-gray-500 text-center mb-8">{text.signUpModalDesc}</p><form><div className="space-y-4"><div><label htmlFor="fullName" className="block text-sm font-medium text-gray-700">{text.fullNameLabel}</label><input type="text" id="fullName" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" /></div><div><label htmlFor="email" className="block text-sm font-medium text-gray-700">{text.emailLabel}</label><input type="email" id="email" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" /></div></div><div className="mt-8"><button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">{text.completeSignUpBtn}</button></div></form></div></div>);
};

export default function WyncellPage() {
    const { language, text } = useAppContext();
    const router = useRouter();
    const supabase = createClientComponentClient();

    const [activeProduct, setActiveProduct] = useState('home');
    const [user, setUser] = useState(null);
    const [openFaq, setOpenFaq] = useState(null);
    const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    
    useEffect(() => {
        const getUser = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          setUser(user);
        };
        getUser();
    }, [supabase]);

    const currentContent = useMemo(() => pageData[activeProduct]?.[language] || pageData.home.en, [activeProduct, language]);

    const handleFaqToggle = idx => {
        setOpenFaq(openFaq === idx ? null : idx);
    };

    const handleGetStartedClick = () => {
        if (!user) {
            router.push('/login');
            return;
        }
        setIsAvailabilityModalOpen(true);
    };

    const handleAvailabilitySuccess = () => {
        setIsAvailabilityModalOpen(false);
        setIsSignUpModalOpen(true);
    };

    const handleClaimFreeESIM = async () => {
        if (!user) {
          router.push('/login');
          return;
        }
        setIsClaiming(true);
        // ... claim logic
        setIsClaiming(false);
    };
    
    const productOptions = [
        { id: 'home', label: text?.footerServices?.split(' ')[0] || 'Home', icon: HomeIcon },
        { id: 'business', label: "Business", icon: BusinessIcon },
    ];

    return (
        <div className="font-sans antialiased bg-gray-50 text-gray-800">
            <AvailabilityModal isOpen={isAvailabilityModalOpen} onClose={() => setIsAvailabilityModalOpen(false)} onAvailable={handleAvailabilitySuccess} text={text} />
            <SignUpModal isOpen={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)} text={text} />

            <main>
                {/* --- HERO SECTION --- */}
                <section className="relative text-white overflow-hidden">
                    <div className="absolute inset-0">
                        {currentContent.hero.image && <Image 
                            src={currentContent.hero.image} 
                            alt={currentContent.hero.title} 
                            fill={true} 
                            style={{objectFit: 'cover'}}
                            className="transition-all duration-700 ease-in-out transform"
                            key={`${activeProduct}-${language}`}
                        />}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40 text-center">
                        <div className="max-w-4xl mx-auto">
                            <h1 className="text-4xl md:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-down" key={`${activeProduct}-${language}-title`}>
                                {currentContent.hero.title}
                            </h1>
                            <p className="text-xl md:text-2xl mb-10 opacity-90 animate-fade-in-up" key={`${activeProduct}-${language}-desc`}>
                                {currentContent.hero.description}
                            </p>
                            <div className="flex items-center justify-center space-x-4">
                                <button onClick={handleGetStartedClick} className="bg-white text-blue-700 hover:bg-gray-200 px-8 py-4 rounded-lg font-bold text-lg transition duration-300 transform hover:scale-105 shadow-lg">{text.getStarted}</button>
                                <button onClick={handleClaimFreeESIM} className="bg-green-500 text-white hover:bg-green-600 px-8 py-4 rounded-lg font-bold text-lg transition duration-300 transform hover:scale-105 shadow-lg animate-pulse">
                                    {text.claimFreeESIM}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* --- PLANS SECTION --- */}
                <section id="plans" className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">{text.homePage.plansTitle}</h2>
                        <div className="grid md:grid-cols-4 gap-8">
                            {currentContent.plans.map((plan, i) => (
                                <div key={i} className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${plan.popular ? 'border-4 border-blue-500' : 'border-4 border-transparent'}`}>
                                {plan.popular && <div className="bg-blue-500 text-white text-center py-2 font-semibold">{text.mostPopular}</div>}
                                <div className="p-8 text-center">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                    <p className="text-gray-500 mb-6 font-semibold">{plan.speed}</p>
                                    <div className="mb-6">
                                    <span className="text-5xl font-extrabold text-gray-900">${plan.price}</span>
                                    <span className="text-gray-500">{text.perMonth}</span>
                                    </div>
                                    <ul className="space-y-4 mb-8 text-left">
                                    {plan.features.map((feature, j) => (
                                        <li key={j} className="flex items-center text-gray-600"><CheckIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" /> <span>{feature}</span></li>
                                    ))}
                                    </ul>
                                    <button onClick={handleGetStartedClick} className="block w-full bg-gray-900 hover:bg-gray-700 text-white text-center py-4 rounded-lg font-semibold transition duration-300">{text.getStarted}</button>
                                </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- FEATURES SECTION --- */}
                <section id="features" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">{text.featuresTitle}</h2>
                        <div className="grid md:grid-cols-3 gap-10">
                            {currentContent.features.map((feature, i) => (
                                <div key={i} className="text-center">
                                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto mb-5">
                                        {React.createElement(productOptions[i % productOptions.length].icon, { className: "w-8 h-8" })}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 text-lg">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- FREE ESIM SECTION --- */}
                <section id="free-esim" className="py-20 bg-gray-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10">
                        <div className="md:w-1/2 text-center md:text-left">
                            <h2 className="text-4xl font-bold mb-4">{text.freeESIMTitle}</h2>
                            <p className="text-lg text-gray-300 mb-6">{text.freeESIMDesc}</p>
                            <button onClick={handleClaimFreeESIM} disabled={isClaiming} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition duration-300 transform hover:scale-105 shadow-lg disabled:bg-gray-500 disabled:scale-100">
                                {isClaiming ? 'Claiming...' : (user ? text.claimFreeESIM : text.signUp)}
                            </button>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            <Image src="https://images.unsplash.com/photo-1517404215738-15263e9f9178?q=80&w=2070&auto=format&fit=crop" alt="Person traveling and using a phone" width={500} height={500} className="rounded-2xl shadow-2xl" />
                        </div>
                    </div>
                </section>

                {/* --- SUBSCRIBE SECTION --- */}
                <section className="py-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-gray-900">{text.subscribeTitle}</h2>
                        <p className="text-lg text-gray-600 mt-3 mb-6">{text.subscribeDesc}</p>
                        <form className="flex justify-center max-w-lg mx-auto">
                            <input type="email" placeholder="Enter your email" className="flex-grow px-5 py-3 border-2 border-r-0 border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <button type="submit" className="bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-r-lg font-semibold transition duration-300">{text.subscribeBtn}</button>
                        </form>
                    </div>
                </section>

                {/* --- FAQ SECTION --- */}
                <section id="support" className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">{text.faqTitle}</h2>
                        <div className="space-y-4">
                        {currentContent.faqs.map((item, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                            <button onClick={() => handleFaqToggle(idx)} className="w-full flex justify-between items-center p-6 text-left text-xl font-semibold hover:bg-gray-50 focus:outline-none">
                                <span>{item.q}</span>
                                <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${openFaq === idx ? "rotate-180" : ""}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === idx ? "max-h-96" : "max-h-0"}`}>
                                <div className="p-6 pt-0">
                                <p className="text-gray-600 text-lg">{item.a}</p>
                                </div>
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </section>
            </main>
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                        <div>
                        <h3 className="text-lg font-semibold mb-4">{text.footerServices}</h3>
                        <ul className="space-y-3">
                            <li><a href="#" onClick={(e) => {e.preventDefault(); setActiveProduct('home')}} className="text-gray-400 hover:text-white">Home Internet</a></li>
                            <li><Link href="/business" className="text-gray-400 hover:text-white">Business Internet</Link></li>
                            <li><Link href="/esims" className="text-gray-400 hover:text-white">Global eSIM</Link></li>
                        </ul>
                        </div>
                        <div>
                        <h3 className="text-lg font-semibold mb-4">{text.footerCompany}</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">News</a></li>
                        </ul>
                        </div>
                        <div>
                        <h3 className="text-lg font-semibold mb-4">{text.footerSupport}</h3>
                        <ul className="space-y-3">
                            <li><a href="#support" className="text-gray-400 hover:text-white">FAQs</a></li>
                            <li><a href="mailto:support@wyncell.ca" className="text-gray-400 hover:text-white">{text.contactUs}</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Network Status</a></li>
                        </ul>
                        </div>
                        <div>
                        <h3 className="text-lg font-semibold mb-4">{text.footerConnect}</h3>
                        <div className="flex space-x-5 mb-4">
                            <SocialIcon href="#"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></SocialIcon>
                            <SocialIcon href="#"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049 1.064.218 1.791.465 2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zM12 8.41a3.59 3.59 0 110 7.18 3.59 3.59 0 010-7.18zM16.862 6.202a1.238 1.238 0 100 2.475 1.238 1.238 0 000-2.475z" clipRule="evenodd" /></svg></SocialIcon>
                            <SocialIcon href="#"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg></SocialIcon>
                        </div>
                        <p className="mt-4">support@wyncell.ca</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 pt-8 mt-8 text-center text-gray-400">
                        <p>&copy; 2025 Wyncell Canada Inc. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
