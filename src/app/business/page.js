'use client';

import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import SiteLayout from '../SiteLayout';
import Image from 'next/image';
import Link from 'next/link';

// --- Reusable Icons for this page ---
const CheckIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>;
const ChevronDownIcon = ({ className }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>;

// --- Data specific to the Business Page ---
const businessPageData = {
    en: {
        hero: { title: "Powerful Internet to Drive Your Business", description: "Keep your business running at full speed with our reliable, high-performance internet and dedicated support.", image: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?q=80&w=2070&auto=format&fit=crop" },
        plans: [
            { name: "Biz Starter 60", price: "69.95", speed: "60 Mbps", features: ["1 Static IP Included", "99.5% Uptime Guarantee", "Next-Day Support"], popular: false, currency: 'USD' },
            { name: "Biz Growth 120", price: "89.95", speed: "120 Mbps", features: ["2 Static IPs Included", "99.9% Uptime Guarantee", "24/7 Priority Support"], popular: true, currency: 'USD' },
            { name: "Biz Pro 400", price: "119.95", speed: "400 Mbps", features: ["5 Static IPs Included", "99.9% Uptime Guarantee", "Dedicated Account Manager"], popular: false, currency: 'USD' },
            { name: "Enterprise Fiber", price: "249.95", speed: "1 Gbps", features: ["Custom SLA Available", "99.99% Uptime", "Dedicated Fiber Line"], popular: false, currency: 'USD' },
        ],
        faqs: [
            { q: "Do you offer static IP addresses?", a: "Yes, all our business plans come with at least one static IP address, with more available as needed." },
            { q: "What is your uptime guarantee?", a: "We offer up to a 99.99% uptime guarantee depending on the plan, ensuring your business stays connected." },
        ]
    },
    fr: {
        hero: { title: "Internet Puissant pour Propulser Votre Entreprise", description: "Maintenez votre entreprise à pleine vitesse avec notre internet fiable, performant et notre soutien dédié.", image: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?q=80&w=2070&auto=format&fit=crop" },
        plans: [
            { name: "Affaires Débutant 60", price: "69.95", speed: "60 Mbps", features: ["1 IP statique incluse", "Garantie de disponibilité de 99,5 %", "Soutien le lendemain"], popular: false, currency: 'USD' },
            { name: "Affaires Croissance 120", price: "89.95", speed: "120 Mbps", features: ["2 IP statiques incluses", "Garantie de disponibilité de 99,9 %", "Soutien prioritaire 24/7"], popular: true, currency: 'USD' },
            { name: "Affaires Pro 400", price: "119.95", speed: "400 Mbps", features: ["5 IP statiques incluses", "Garantie de disponibilité de 99,9 %", "Gestionnaire de compte dédié"], popular: false, currency: 'USD' },
            { name: "Fibre Entreprise", price: "249.95", speed: "1 Gbps", features: ["SLA personnalisé disponible", "Disponibilité de 99,99 %", "Ligne fibre dédiée"], popular: false, currency: 'USD' },
        ],
        faqs: [
            { q: "Offrez-vous des adresses IP statiques ?", a: "Oui, tous nos forfaits affaires incluent au moins une adresse IP statique, avec plus disponibles si nécessaire." },
            { q: "Quelle est votre garantie de disponibilité ?", a: "Nous offrons jusqu'à 99,99 % de garantie de disponibilité selon le forfait, assurant que votre entreprise reste connectée." },
        ]
    },
    sp: {
        hero: { title: "Internet Potente para Impulsar tu Negocio", description: "Mantén tu negocio funcionando a toda velocidad con nuestro internet confiable, de alto rendimiento y soporte dedicado.", image: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?q=80&w=2070&auto=format&fit=crop" },
        plans: [
            { name: "Negocio Básico 60", price: "69.95", speed: "60 Mbps", features: ["1 IP estática incluida", "Garantía de tiempo de actividad del 99,5 %", "Soporte al día siguiente"], popular: false, currency: 'USD' },
            { name: "Negocio Crecimiento 120", price: "89.95", speed: "120 Mbps", features: ["2 IPs estáticas incluidas", "Garantía de tiempo de actividad del 99,9 %", "Soporte prioritario 24/7"], popular: true, currency: 'USD' },
            { name: "Negocio Pro 400", price: "119.95", speed: "400 Mbps", features: ["5 IPs estáticas incluidas", "Garantía de tiempo de actividad del 99,9 %", "Gerente de cuenta dedicado"], popular: false, currency: 'USD' },
            { name: "Fibra Empresarial", price: "249.95", speed: "1 Gbps", features: ["SLA personalizado disponible", "99,99 % de tiempo de actividad", "Línea de fibra dedicada"], popular: false, currency: 'USD' },
        ],
        faqs: [
            { q: "¿Ofrecen direcciones IP estáticas?", a: "Sí, todos nuestros planes de negocios incluyen al menos una dirección IP estática, con más disponibles según sea necesario." },
            { q: "¿Cuál es su garantía de tiempo de actividad?", a: "Ofrecemos hasta un 99,99 % de garantía de tiempo de actividad según el plan, asegurando que tu negocio permanezca conectado." },
        ]
    }
};

export default function BusinessPage() {
    const { language, text } = useAppContext();
    const [openFaq, setOpenFaq] = useState(null);

    const content = useMemo(() => businessPageData[language] || businessPageData.en, [language]);

    const handleFaqToggle = idx => {
        setOpenFaq(openFaq === idx ? null : idx);
    };

    return (
        <SiteLayout>
            <main>
                {/* Hero Section */}
                <section className="relative text-white overflow-hidden">
                    <div className="absolute inset-0">
                        <Image 
                            src={content.hero.image} 
                            alt={content.hero.title} 
                            fill={true} 
                            style={{objectFit: 'cover'}}
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40 text-center">
                        <div className="max-w-4xl mx-auto">
                            <h1 className="text-4xl md:text-7xl font-extrabold leading-tight mb-6">{content.hero.title}</h1>
                            <p className="text-xl md:text-2xl mb-10 opacity-90">{content.hero.description}</p>
                            <Link href="/contact" className="bg-white text-blue-700 hover:bg-gray-200 px-8 py-4 rounded-lg font-bold text-lg transition duration-300 transform hover:scale-105 shadow-lg">
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Plans Section */}
                <section id="plans" className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* --- THIS IS THE FIX --- */}
                        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">{text.businessPage.plansTitle}</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {content.plans.map((plan, i) => {
                                const currency = plan.currency || 'USD';
                                const formattedPrice = new Intl.NumberFormat(language, {
                                    style: 'currency',
                                    currency: currency,
                                }).format(plan.price);

                                return (
                                    <div key={i} className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${plan.popular ? 'border-4 border-blue-500' : 'border-4 border-transparent'}`}>
                                        {plan.popular && <div className="bg-blue-500 text-white text-center py-2 font-semibold">MOST POPULAR</div>}
                                        <div className="p-8 text-center">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                            <p className="text-gray-500 mb-6 font-semibold">{plan.speed}</p>
                                            <div className="mb-6">
                                                <span className="text-4xl font-extrabold text-gray-900">{formattedPrice}</span>
                                                <span className="text-gray-500">/month</span>
                                            </div>
                                            <ul className="space-y-4 mb-8 text-left">
                                                {plan.features.map((feature, j) => (
                                                    <li key={j} className="flex items-center text-gray-600"><CheckIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" /> <span>{feature}</span></li>
                                                ))}
                                            </ul>
                                            <Link href="/contact" className="block w-full bg-gray-900 hover:bg-gray-700 text-white text-center py-4 rounded-lg font-semibold transition duration-300">
                                                Get Started
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="support" className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">{text.faqTitle || "Frequently Asked Questions"}</h2>
                        <div className="space-y-4">
                            {content.faqs.map((item, idx) => (
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
        </SiteLayout>
    );
}
