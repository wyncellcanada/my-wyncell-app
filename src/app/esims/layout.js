// src/app/esims/layout.js
import EsimsHeader from "@/components/EsimsHeader";

export default function EsimsLayout({ children }) {
  return (
    <div>
      <EsimsHeader />
      <main>
        {children}
      </main>
    </div>
  );
}