// src/app/esims/page.js
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext } from '@/context/LanguageContext';

// --- New Icons for the Banner ---
const GiftIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>;
const ChevronRightIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>;


function PackageCard({ pkg }) {
  const { text } = useAppContext();
  const firstPackage = pkg.operators[0]?.packages[0];
  if (!firstPackage) return null;

  return (
    <Link href={`/esims/${pkg.slug}`} className="group block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <Image 
          src={pkg.image.url} 
          alt={pkg.title} 
          width={400} 
          height={300} 
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-2xl font-bold text-white shadow-black/50 [text-shadow:0_1px_3px_var(--tw-shadow-color)]">{pkg.title}</h3>
          <p className="text-sm text-gray-200 [text-shadow:0_1px_2px_var(--tw-shadow-color)]">via {pkg.operators[0].title}</p>
        </div>
      </div>
      <div className="p-4 bg-white">
        <p className="text-gray-600 text-sm">{text.startsFrom}</p>
        <p className="text-2xl font-bold text-gray-900">${firstPackage.price}</p>
      </div>
    </Link>
  );
}

export default function EsimsPage() {
  const { text, allPackages, setAllPackages } = useAppContext();
  const [displayedPackages, setDisplayedPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('local');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchAllData() {
      if (allPackages.local.length > 0 && allPackages.global.length > 0) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const localResponse = await fetch(`/api/packages?type=local`);
        if (!localResponse.ok) throw new Error('Could not fetch local packages.');
        const localData = await localResponse.json();
        const globalResponse = await fetch(`/api/packages?type=global`);
        if (!globalResponse.ok) throw new Error('Could not fetch global packages.');
        const globalData = await globalResponse.json();
        setAllPackages({
          local: localData.data || [],
          global: globalData.data || [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAllData();
  }, [setAllPackages, allPackages]);

  const filteredPackages = useMemo(() => {
    let packagesToShow = [];
    if (activeTab === 'local') {
      packagesToShow = allPackages.local;
    } else if (activeTab === 'regional') {
      packagesToShow = allPackages.global.filter(pkg => pkg.slug !== 'world');
    } else if (activeTab === 'global') {
      packagesToShow = allPackages.global.filter(pkg => pkg.slug === 'world');
    }
    const validPackages = packagesToShow.filter(pkg => pkg.operators[0]?.packages[0]);
    if (!searchTerm) {
      return validPackages;
    }
    return validPackages.filter(pkg => 
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeTab, allPackages, searchTerm]);

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
           <h1 className="text-4xl font-bold text-blue-900">{text.plansTitle}</h1>
           <p className="text-xl text-gray-600 mt-2">{text.plansSubtitle}</p>
        </div>

        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a country..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* New Clickable Banner */}
        <div className="max-w-4xl mx-auto mb-12">
            <Link href="/#free-esim" className="group flex items-center justify-between p-5 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex items-center">
                    <div className="p-3 bg-white/30 rounded-full mr-4">
                        <GiftIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]">How to get your free eSIM</h3>
                        <p className="text-sm text-white/90">Claim your starter package on us!</p>
                    </div>
                </div>
                <ChevronRightIcon className="w-7 h-7 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
            </Link>
        </div>
        
        <div className="mb-8 flex justify-center border-b">
          <button onClick={() => setActiveTab('local')} className={`px-6 py-3 text-lg font-medium ${activeTab === 'local' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-500 hover:text-blue-600'}`}>{text.local}</button>
          <button onClick={() => setActiveTab('regional')} className={`px-6 py-3 text-lg font-medium ${activeTab === 'regional' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-500 hover:text-blue-600'}`}>{text.regional}</button>
          <button onClick={() => setActiveTab('global')} className={`px-6 py-3 text-lg font-medium ${activeTab === 'global' ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-500 hover:text-blue-600'}`}>{text.global}</button>
        </div>

        {isLoading && <p className="text-center text-lg py-10">{text.loading}</p>}
        {error && <p className="text-center text-red-500 text-lg py-10">Error: {error}</p>}
        
        {!isLoading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPackages.length > 0 ? (
                filteredPackages.map((pkg) => ( <PackageCard key={pkg.slug} pkg={pkg} /> ))
            ) : ( <p className="text-center col-span-full py-10">No packages found for "{searchTerm}".</p> )}
          </div>
        )}
      </div>
    </div>
  );
}