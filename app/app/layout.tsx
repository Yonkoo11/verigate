import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { WalletConnect } from "@/components/WalletConnect";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "Verigate",
  description: "Verify before you transfer. Compliance middleware for tokenized RWA on BNB Chain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ToastProvider>
            <header className="sticky top-0 z-40 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/95 backdrop-blur-sm">
              <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center text-white text-xs font-bold">
                    VG
                  </div>
                  <span className="text-lg font-semibold text-[var(--text-primary)]">
                    Verigate
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-[var(--radius-sm)] bg-[var(--accent-purple)]/15 text-[var(--accent-purple)] border border-[var(--accent-purple)]/30">
                    Testnet
                  </span>
                </div>
                <WalletConnect />
              </div>
            </header>
            <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
