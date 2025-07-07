'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '@/context/LanguageContext';
import Image from 'next/image';

export default function EsimDetailPage({ params }) {
  const { text, allPackages } = useAppContext();
  
  const { slug } = params;

  const details = useMemo(() => {
    return allPackages.local.find(p => p.slug === slug) || 
           allPackages.global.find(p => p.slug === slug);
  }, [allPackages, slug]);

  const [orderingPackageId, setOrderingPackageId] = useState(null);

  async function handleBuyNow(packageId) {
    setOrderingPackageId(packageId);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package_id: packageId, quantity: 1 }),
      });
      const orderData = await response.json();
      if (!response.ok) throw new Error(orderData.details || 'Failed to place order.');
      alert(`${text.orderSuccess}\n\nQR Code Data: ${orderData.data.qr_code}`);
    } catch (err) {
      alert(`${text.orderFailed}: ${err.message}`);
    } finally {
      setOrderingPackageId(null);
    }
  }

  if (!details) {
    return <p className="text-center text-lg p-12">Plan details not found. Please go back and try again.</p>;
  }
  
  const operator = details.operators[0];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="flex items-center space-x-4 mb-8">
          {details.image && <img src={details.image.url} alt={`${details.title} flag`} className="w-16 h-12 object-cover rounded-md shadow-lg" />}
          <div>
            <h1 className="text-4xl font-bold">{details.title}</h1>
            <p className="text-xl text-gray-600">eSIM Plans by {operator.title}</p>
          </div>
        </div>

        <div className="space-y-4">
          {operator.packages.map(pkg => (
            <div key={pkg.id} className="border rounded-lg p-6 flex justify-between items-center hover:bg-gray-50">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{pkg.data} - {pkg.day} Days</h2>
                <p className="text-gray-500">{pkg.short_info || 'Data-only eSIM.'}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${pkg.price}</p>
                <button
                  onClick={() => handleBuyNow(pkg.id)}
                  disabled={orderingPackageId === pkg.id}
                  className="mt-2 bg-green-600 text-white font-bold py-2 px-6 rounded hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  {orderingPackageId === pkg.id ? text.ordering : text.buyNow}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}