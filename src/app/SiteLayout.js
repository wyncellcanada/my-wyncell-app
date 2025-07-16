// src/app/SiteLayout.js
import MainHeader from '../components/MainHeader';

export default function SiteLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainHeader />
      <main className="flex-grow">
        {children}
      </main>
      {/* You can add a shared footer component here later if you wish */}
    </div>
  );
}
