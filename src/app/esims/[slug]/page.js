'use client';

import { useState, useEffect, use } from 'react';
import { useAppContext } from '../../../context/AppContext';
import Image from 'next/image';
import Link from 'next/link';
import SiteLayout from '../../SiteLayout';

export default function EsimDetailPage({ params }) {
    const { slug } = use(params);
    const { text, language, allPackages } = useAppContext();

    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const packageFromContext = allPackages.local.find(p => p.slug === slug) || 
                                   allPackages.global.find(p => p.slug === slug);

        if (packageFromContext) {
            setDetails(packageFromContext);
        }
        setIsLoading(false); 
    }, [allPackages, slug]);

    if (isLoading) {
        return <SiteLayout><p className="text-center text-lg p-12">{text.loading}</p></SiteLayout>;
    }

    if (!details) {
        return <SiteLayout><p className="text-center text-lg p-12">{text.notFound}</p></SiteLayout>;
    }

    if (!details.operators || details.operators.length === 0) {
        return <SiteLayout><p className="text-center text-lg p-12">{text.noOperator}</p></SiteLayout>;
    }
  
    const operator = details.operators[0];
    const currency = operator.currency || 'USD';

    const getTranslatedDescription = (shortInfo) => {
        if (shortInfo && shortInfo.includes("phone number")) {
            return text.noPhoneNumber;
        }
        return text.dataOnly;
    };

    return (
        <SiteLayout>
            <div className="bg-white min-h-screen">
                <div className="max-w-4xl mx-auto py-12 px-4">
                    <div className="flex items-center space-x-4 mb-8">
                        {details.image && <Image src={details.image.url} alt={`${details.title} flag`} width={64} height={48} className="w-16 h-12 object-cover rounded-md shadow-lg" />}
                        <div>
                            <h1 className="text-4xl font-bold">{details.title}</h1>
                            <p className="text-xl text-gray-600">eSIM Plans by {operator.title}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {operator.packages.map(pkg => {
                            // --- THIS IS THE FIX ---
                            // 1. Format the number and symbol based on locale
                            const formattedPrice = new Intl.NumberFormat(language, {
                                style: 'currency',
                                currency: currency,
                            }).format(pkg.price);
                            
                            // 2. Create the full, unambiguous price string
                            const displayPrice = `${formattedPrice} ${currency}`;

                            return (
                                <div key={pkg.id} className="border rounded-lg p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-gray-800">{pkg.data} - {pkg.day} {text.days}</h2>
                                        <p className="text-gray-500">{getTranslatedDescription(pkg.short_info)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">{displayPrice}</p>
                                        <Link
                                            href={`/checkout?package_id=${pkg.id}&price=${pkg.price}&name=${encodeURIComponent(details.title + " " + pkg.data)}&currency=${currency}`}
                                            className="mt-2 inline-block bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            {text.buyNow}
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
