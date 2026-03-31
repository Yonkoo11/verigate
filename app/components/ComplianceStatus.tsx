"use client";

import { useAccount, useReadContract } from "wagmi";
import { addresses, complianceEngineAbi, rwaTokenAbi } from "@/lib/contracts";

function StatusBadge({
  ok,
  label,
  loading,
}: {
  ok: boolean;
  label: string;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 py-2">
        <div className="w-4 h-4 rounded-full bg-[var(--border-primary)] animate-pulse" />
        <span className="text-sm text-[var(--text-muted)]">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 py-2">
      {ok ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-[var(--accent-green)] flex-shrink-0"
        >
          <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.15" />
          <path
            d="M5 8l2 2 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-[var(--accent-red)] flex-shrink-0"
        >
          <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.15" />
          <path
            d="M5.5 5.5l5 5M10.5 5.5l-5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
      <span
        className={`text-sm ${ok ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"}`}
      >
        {label}
      </span>
    </div>
  );
}

export function ComplianceStatus() {
  const { address } = useAccount();

  const { data: hasAttestation, isLoading: attestLoading } = useReadContract({
    address: addresses.complianceEngine,
    abi: complianceEngineAbi,
    functionName: "hasAttestation",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!addresses.complianceEngine },
  });

  const { data: attestationUID } = useReadContract({
    address: addresses.complianceEngine,
    abi: complianceEngineAbi,
    functionName: "attestationUIDs",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!addresses.complianceEngine },
  });

  const { data: isFrozen, isLoading: frozenLoading } = useReadContract({
    address: addresses.rwaToken,
    abi: rwaTokenAbi,
    functionName: "frozen",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!addresses.rwaToken },
  });

  const { data: modules } = useReadContract({
    address: addresses.complianceEngine,
    abi: complianceEngineAbi,
    functionName: "getModules",
    query: { enabled: !!addresses.complianceEngine },
  });

  const noEngine = !addresses.complianceEngine;

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-primary)] bg-[var(--bg-card)] p-6">
      <h2 className="text-lg font-semibold mb-4">Compliance Status</h2>

      {noEngine ? (
        <p className="text-sm text-[var(--text-muted)]">
          No compliance engine configured. Set NEXT_PUBLIC_COMPLIANCE_ENGINE_ADDRESS in .env.
        </p>
      ) : (
        <>
          <div className="space-y-1 mb-4">
            <StatusBadge
              ok={!!hasAttestation}
              label={
                hasAttestation
                  ? "BAS attestation verified"
                  : "No BAS attestation found"
              }
              loading={attestLoading}
            />
            <StatusBadge
              ok={!isFrozen}
              label={isFrozen ? "Address is frozen" : "Address is not frozen"}
              loading={frozenLoading}
            />
          </div>

          {attestationUID && attestationUID !== "0x0000000000000000000000000000000000000000000000000000000000000000" && (
            <div className="mt-3 pt-3 border-t border-[var(--border-primary)]">
              <p className="text-xs text-[var(--text-muted)] mb-1">
                Attestation UID
              </p>
              <p className="text-xs font-mono text-[var(--text-secondary)] break-all">
                {attestationUID as string}
              </p>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-[var(--border-primary)]">
            <p className="text-xs text-[var(--text-muted)] mb-1">
              Active Compliance Modules
            </p>
            {modules && (modules as string[]).length > 0 ? (
              <div className="space-y-1 mt-1">
                {(modules as string[]).map((mod, i) => (
                  <p key={i} className="text-xs font-mono text-[var(--text-secondary)]">
                    {mod.slice(0, 6)}...{mod.slice(-4)}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--text-muted)]">
                No modules registered
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
