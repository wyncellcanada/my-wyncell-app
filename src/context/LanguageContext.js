"use client";

import React, { createContext, useState, useContext } from 'react';

const staticText = {
    en: {
        loading: "Loading details...",
        buyNow: "Buy Now",
        ordering: "Ordering...",
        orderFailed: "Order Failed",
        orderSuccess: "Order Successful!",
        plansTitle: "Our International eSIM Plans",
        plansSubtitle: "Stay connected wherever you travel.",
        local: "Local",
        regional: "Regional",
        global: "Global",
        goBack: "Go back",
        viewPlans: "View Plans",
        noPackages: "No packages available for this category.",
        startsFrom: "Starts from",
    },
    fr: {
        loading: "Chargement des détails...",
        buyNow: "Acheter",
        ordering: "Commande...",
        orderFailed: "Échec de la commande",
        orderSuccess: "Commande réussie !",
        plansTitle: "Nos Forfaits eSIM Internationaux",
        plansSubtitle: "Restez connecté où que vous soyez.",
        local: "Local",
        regional: "Régional",
        global: "Mondial",
        goBack: "Retourner",
        viewPlans: "Voir les Forfaits",
        noPackages: "Aucun forfait disponible pour cette catégorie.",
        startsFrom: "À partir de",
    },
    sp: {
        loading: "Cargando detalles...",
        buyNow: "Comprar ahora",
        ordering: "Ordenando...",
        orderFailed: "Error en el pedido",
        orderSuccess: "¡Pedido Exitoso!",
        plansTitle: "Nuestros Planes eSIM Internacionales",
        plansSubtitle: "Mantente conectado dondequiera que viajes.",
        local: "Local",
        regional: "Regional",
        global: "Global",
        goBack: "Volver",
        viewPlans: "Ver Planes",
        noPackages: "No hay paquetes disponibles para esta categoría.",
        startsFrom: "Desde",
    }
};

const AppContext = createContext();

export function AppProvider({ children }) {
    const [language, setLanguage] = useState('en');
    const [allPackages, setAllPackages] = useState({ local: [], global: [] });

    const value = {
        language,
        setLanguage,
        text: staticText[language] || staticText.en,
        allPackages,
        setAllPackages,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}