"use client";

import { useAccount } from "wagmi";
import { TokenDashboard } from "@/components/TokenDashboard";
import { ComplianceStatus } from "@/components/ComplianceStatus";
import { TransferForm } from "@/components/TransferForm";
import { IssuerPanel } from "@/components/IssuerPanel";

function HeroSection() {
  return (
    <div className="py-16 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/20 text-xs text-[var(--accent-blue)] mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
        Live on BSC Testnet
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
        Compliance for Tokenized
        <br />
        Real-World Assets
      </h1>

      <p className="text-lg text-[var(--text-secondary)] max-w-lg mx-auto mb-8 leading-relaxed">
        Verify before you transfer. BNB-native compliance
        powered by BAS attestations.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <div className="p-4 rounded-[var(--radius-md)] border border-[var(--border-primary)] bg-[var(--bg-card)]">
          <p className="text-2xl font-bold tabular-nums text-[var(--accent-blue)]">
            BAS
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Attestation-based identity
          </p>
        </div>
        <div className="p-4 rounded-[var(--radius-md)] border border-[var(--border-primary)] bg-[var(--bg-card)]">
          <p className="text-2xl font-bold tabular-nums text-[var(--accent-purple)]">
            Modular
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Pluggable compliance modules
          </p>
        </div>
        <div className="p-4 rounded-[var(--radius-md)] border border-[var(--border-primary)] bg-[var(--bg-card)]">
          <p className="text-2xl font-bold tabular-nums text-[var(--accent-green)]">
            ERC-3643
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Compatible token standard
          </p>
        </div>
      </div>

      <p className="text-sm text-[var(--text-muted)] mt-12">
        Connect your wallet to get started
      </p>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TokenDashboard />
        <ComplianceStatus />
      </div>
      <TransferForm />
      <IssuerPanel />
    </div>
  );
}

export default function Home() {
  const { isConnected } = useAccount();
  return isConnected ? <Dashboard /> : <HeroSection />;
}
