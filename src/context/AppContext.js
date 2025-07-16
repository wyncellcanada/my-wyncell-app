'use client';

import React, { createContext, useState, useMemo, useContext } from 'react';

const staticText = {
    en: {
        goBack: "Go back",
        startsFrom: "Starts from",
        plansTitle: "eSIM Plans",
        plansSubtitle: "Stay connected wherever you go. Choose your destination.",
        local: "Local",
        regional: "Regional",
        global: "Global",
        loading: "Loading...",
        buyNow: "Buy Now",
        notFound: "Package not found.",
        noOperator: "No operator information available for this package.",
        days: "Days",
        dataOnly: "Data-only eSIM.",
        noPhoneNumber: "This eSIM doesn't come with a phone number.",
        login: "Login",
        signUp: "Sign Up",
        mostPopular: "MOST POPULAR",
        perMonth: "/month",
        getStarted: "Get Started",
        claimFreeESIM: "Claim Your Free eSIM",
        promoBanner: "Traveling soon? Claim your FREE starter eSIM now!",
        availabilityModalTitle: "Check Availability",
        availabilityModalDesc: "Enter your postal code to see plans available in your area.",
        postalCodeLabel: "Postal Code",
        checkAvailabilityBtn: "Check Availability",
        checkingBtn: "Checking...",
        signUpModalTitle: "Great News!",
        signUpModalDesc: "Wyncell is available in your area. Let's get you set up.",
        fullNameLabel: "Full Name",
        emailLabel: "Email Address",
        completeSignUpBtn: "Complete Sign Up",
        subscribeTitle: "Stay in the Loop",
        subscribeDesc: "Subscribe to our newsletter for the latest deals, new destinations, and tech tips.",
        subscribeBtn: "Subscribe",
        featuresTitle: "Why Choose Wyncell?",
        freeESIMTitle: "Your First Trip, Connected for Free",
        freeESIMDesc: "To welcome you to the future of travel, your first starter eSIM is on us. Experience seamless global connectivity as a Wyncell customer and enjoy exclusive rates on all future plans.",
        faqTitle: "Frequently Asked Questions",
        footerServices: "Services",
        footerCompany: "Company",
        footerSupport: "Support",
        footerConnect: "Connect",
        contactUs: "Contact Us",
        homePage: {
            plansTitle: "Choose Your Perfect Internet Plan"
        },
        checkout: {
            orderSummary: "Order Summary",
            plan: "Plan",
            price: "Price",
            cardDetails: "Card Details",
            processing: "Processing...",
            pay: "Pay",
            loading: "Loading Secure Checkout...",
            emptyCartTitle: "Your cart is empty.",
            emptyCartSubtitle: "Please go back to select a plan.",
            viewPlans: "View Plans",
            secureCheckout: "Secure Checkout"
        },
        loginPage: {
            welcome: "Welcome Back",
            emailLabel: "Email Address",
            passwordLabel: "Password",
            signInBtn: "Sign In",
            noAccount: "Don't have an account?",
            signUpLink: "Sign Up"
        },
        businessPage: {
            title: "Internet Solutions for Your Business",
            subtitle: "Powerful, reliable connectivity designed to keep your business running at full speed. Explore our plans below.",
            plansTitle: "Business Internet Plans",
            comingSoon: "Business plans coming soon. Please check back later!"
        }
    },
    fr: {
        goBack: "Retourner",
        startsFrom: "À partir de",
        plansTitle: "Forfaits eSIM",
        plansSubtitle: "Restez connecté où que vous alliez. Choisissez votre destination.",
        local: "Local",
        regional: "Régional",
        global: "Mondial",
        loading: "Chargement...",
        buyNow: "Acheter maintenant",
        notFound: "Forfait non trouvé.",
        noOperator: "Aucune information d'opérateur disponible.",
        days: "Jours",
        dataOnly: "eSIM de données uniquement.",
        noPhoneNumber: "Cette eSIM n'inclut pas de numéro de téléphone.",
        login: "Connexion",
        signUp: "S'inscrire",
        mostPopular: "LE PLUS POPULAIRE",
        perMonth: "/mois",
        getStarted: "Commencer",
        claimFreeESIM: "Réclamez votre eSIM gratuite",
        promoBanner: "Vous voyagez bientôt ? Réclamez votre eSIM de démarrage GRATUITE maintenant !",
        availabilityModalTitle: "Vérifier la disponibilité",
        availabilityModalDesc: "Entrez votre code postal pour voir les forfaits disponibles dans votre région.",
        postalCodeLabel: "Code Postal",
        checkAvailabilityBtn: "Vérifier la disponibilité",
        checkingBtn: "Vérification...",
        signUpModalTitle: "Bonne nouvelle !",
        signUpModalDesc: "Wyncell est disponible dans votre région. Mettons tout en place.",
        fullNameLabel: "Nom complet",
        emailLabel: "Adresse e-mail",
        completeSignUpBtn: "Terminer l'inscription",
        subscribeTitle: "Restez informé",
        subscribeDesc: "Abonnez-vous à notre newsletter pour les dernières offres, nouvelles destinations et conseils techniques.",
        subscribeBtn: "S'abonner",
        featuresTitle: "Pourquoi Choisir Wyncell ?",
        freeESIMTitle: "Votre Premier Voyage, Connecté Gratuitement",
        freeESIMDesc: "Pour vous accueillir dans le futur du voyage, votre première eSIM de démarrage est offerte. Profitez d'une connectivité mondiale et de tarifs exclusifs.",
        faqTitle: "Questions Fréquemment Posées",
        footerServices: "Services",
        footerCompany: "Entreprise",
        footerSupport: "Soutien",
        footerConnect: "Connecter",
        contactUs: "Contactez-nous",
        homePage: {
            plansTitle: "Choisissez Votre Forfait Internet Idéal"
        },
        checkout: {
            orderSummary: "Résumé de la commande",
            plan: "Forfait",
            price: "Prix",
            cardDetails: "Détails de la carte",
            processing: "Traitement...",
            pay: "Payer",
            loading: "Chargement du paiement sécurisé...",
            emptyCartTitle: "Votre panier est vide.",
            emptyCartSubtitle: "Veuillez retourner pour sélectionner un forfait.",
            viewPlans: "Voir les forfaits",
            secureCheckout: "Paiement Sécurisé"
        },
        loginPage: {
            welcome: "Bon retour",
            emailLabel: "Adresse e-mail",
            passwordLabel: "Mot de passe",
            signInBtn: "Se connecter",
            noAccount: "Vous n'avez pas de compte ?",
            signUpLink: "S'inscrire"
        },
        businessPage: {
            title: "Solutions Internet pour Votre Entreprise",
            subtitle: "Une connectivité puissante et fiable conçue pour que votre entreprise fonctionne à plein régime. Découvrez nos forfaits ci-dessous.",
            plansTitle: "Forfaits Internet pour Entreprises",
            comingSoon: "Forfaits affaires bientôt disponibles. Veuillez revenir plus tard !"
        }
    },
    sp: {
        goBack: "Volver",
        startsFrom: "Desde",
        plansTitle: "Planes eSIM",
        plansSubtitle: "Mantente conectado dondequiera que vayas. Elige tu destino.",
        local: "Local",
        regional: "Regional",
        global: "Global",
        loading: "Cargando...",
        buyNow: "Comprar ahora",
        notFound: "Paquete no encontrado.",
        noOperator: "No hay información de operador disponible.",
        days: "Días",
        dataOnly: "eSIM solo de datos.",
        noPhoneNumber: "Esta eSIM no incluye un número de teléfono.",
        login: "Iniciar Sesión",
        signUp: "Registrarse",
        mostPopular: "MÁS POPULAR",
        perMonth: "/mes",
        getStarted: "Empezar",
        claimFreeESIM: "Reclama tu eSIM Gratis",
        promoBanner: "¿Viajas pronto? ¡Reclama tu eSIM de inicio GRATIS ahora!",
        availabilityModalTitle: "Verificar Disponibilidad",
        availabilityModalDesc: "Ingresa tu código postal para ver los planes disponibles en tu área.",
        postalCodeLabel: "Código Postal",
        checkAvailabilityBtn: "Verificar Disponibilidad",
        checkingBtn: "Verificando...",
        signUpModalTitle: "¡Buenas noticias!",
        signUpModalDesc: "Wyncell está disponible en tu área. Vamos a configurarte.",
        fullNameLabel: "Nombre Completo",
        emailLabel: "Dirección de Correo Electrónico",
        completeSignUpBtn: "Completar Registro",
        subscribeTitle: "Mantente al Día",
        subscribeDesc: "Suscríbete a nuestro boletín para recibir las últimas ofertas, nuevos destinos y consejos tecnológicos.",
        subscribeBtn: "Suscribir",
        featuresTitle: "¿Por Qué Elegir Wyncell?",
        freeESIMTitle: "Tu Primer Viaje, Conectado Gratis",
        freeESIMDesc: "Para darte la bienvenida al futuro de los viajes, tu primera eSIM de inicio es gratis. Disfruta de conectividad global y tarifas exclusivas.",
        faqTitle: "Preguntas Frecuentes",
        footerServices: "Servicios",
        footerCompany: "Compañía",
        footerSupport: "Soporte",
        footerConnect: "Conectar",
        contactUs: "Contáctanos",
        homePage: {
            plansTitle: "Elige Tu Plan de Internet Perfecto"
        },
        checkout: {
            orderSummary: "Resumen del Pedido",
            plan: "Plan",
            price: "Precio",
            cardDetails: "Detalles de la Tarjeta",
            processing: "Procesando...",
            pay: "Pagar",
            loading: "Cargando Pago Seguro...",
            emptyCartTitle: "Tu carrito está vacío.",
            emptyCartSubtitle: "Por favor, vuelve para seleccionar un plan.",
            viewPlans: "Ver Planes",
            secureCheckout: "Pago Seguro"
        },
        loginPage: {
            welcome: "Bienvenido de nuevo",
            emailLabel: "Dirección de Correo Electrónico",
            passwordLabel: "Contraseña",
            signInBtn: "Iniciar Sesión",
            noAccount: "¿No tienes una cuenta?",
            signUpLink: "Registrarse"
        },
        businessPage: {
            title: "Soluciones de Internet para su Negocio",
            subtitle: "Conectividad potente y confiable diseñada para mantener su negocio funcionando a toda velocidad. Explore nuestros planes a continuación.",
            plansTitle: "Planes de Internet para Negocios",
            comingSoon: "Los planes para empresas estarán disponibles pronto. ¡Por favor, vuelva más tarde!"
        }
    }
};


const AppContext = createContext();

export function AppContextProvider({ children }) {
    const [language, setLanguage] = useState('en');
    const [allPackages, setAllPackages] = useState({ local: [], global: [] });

    const text = useMemo(() => {
        const langText = staticText[language] || staticText.en;
        // Deep merge with English as a fallback to prevent errors
        return {
            ...staticText.en,
            ...langText,
            homePage: { ...staticText.en.homePage, ...langText.homePage },
            checkout: { ...staticText.en.checkout, ...langText.checkout },
            loginPage: { ...staticText.en.loginPage, ...langText.loginPage },
            businessPage: { ...staticText.en.businessPage, ...langText.businessPage },
        };
    }, [language]);
    
    const value = {
        language,
        setLanguage,
        text,
        allPackages,
        setAllPackages
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
}
