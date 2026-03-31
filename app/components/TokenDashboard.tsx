"use client";

import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { addresses, rwaTokenAbi, BSC_TESTNET_EXPLORER } from "@/lib/contracts";

function Skeleton() {
  return (
    <div className="h-5 w-24 rounded-[var(--radius-sm)] bg-[var(--border-primary)] animate-pulse" />
  );
}

export function TokenDashboard() {
  const { address } = useAccount();

  const { data: tokenName, isLoading: nameLoading } = useReadContract({
    address: addresses.rwaToken,
    abi: rwaTokenAbi,
    functionName: "name",
  });

  const { data: tokenSymbol, isLoading: symbolLoading } = useReadContract({
    address: addresses.rwaToken,
    abi: rwaTokenAbi,
    functionName: "symbol",
  });

  const { data: decimals } = useReadContract({
    address: addresses.rwaToken,
    abi: rwaTokenAbi,
    functionName: "decimals",
  });

  const { data: balance, isLoading: balanceLoading } = useReadContract({
    address: addresses.rwaToken,
    abi: rwaTokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: totalSupply, isLoading: supplyLoading } = useReadContract({
    address: addresses.rwaToken,
    abi: rwaTokenAbi,
    functionName: "totalSupply",
  });

  const { data: complianceEngine } = useReadContract({
    address: addresses.rwaToken,
    abi: rwaTokenAbi,
    functionName: "complianceEngine",
  });

  const { data: paused } = useReadContract({
    address: addresses.rwaToken,
    abi: rwaTokenAbi,
    functionName: "paused",
  });

  const dec = typeof decimals === "number" ? decimals : 18;
  const formattedBalance =
    balance !== undefined ? formatUnits(balance as bigint, dec) : null;
  const formattedSupply =
    totalSupply !== undefined ? formatUnits(totalSupply as bigint, dec) : null;

  const noToken = !addresses.rwaToken;

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-primary)] bg-[var(--bg-card)] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Token Overview</h2>
        {paused === true && (
          <span className="px-2 py-1 text-xs font-medium rounded-[var(--radius-sm)] bg-[var(--accent-red)]/15 text-[var(--accent-red)] border border-[var(--accent-red)]/30">
            Paused
          </span>
        )}
      </div>

      {noToken ? (
        <p className="text-sm text-[var(--text-muted)]">
          No token address configured. Set NEXT_PUBLIC_RWA_TOKEN_ADDRESS in your .env file.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Token</p>
            {nameLoading || symbolLoading ? (
              <Skeleton />
            ) : (
              <p className="text-sm font-medium">
                {(tokenName as string) ?? "---"}{" "}
                <span className="text-[var(--text-muted)]">
                  ({(tokenSymbol as string) ?? "---"})
                </span>
              </p>
            )}
          </div>

          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Your Balance</p>
            {balanceLoading ? (
              <Skeleton />
            ) : (
              <p className="text-sm font-medium tabular-nums">
                {formattedBalance ?? "0"}{" "}
                <span className="text-[var(--text-muted)]">
                  {(tokenSymbol as string) ?? ""}
                </span>
              </p>
            )}
          </div>

          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Total Supply</p>
            {supplyLoading ? (
              <Skeleton />
            ) : (
              <p className="text-sm font-medium tabular-nums">
                {formattedSupply ?? "0"}
              </p>
            )}
          </div>

          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">
              Compliance Engine
            </p>
            {complianceEngine ? (
              <a
                href={`${BSC_TESTNET_EXPLORER}/address/${complianceEngine}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono text-[var(--accent-blue)] hover:underline"
              >
                {(complianceEngine as string).slice(0, 6)}...
                {(complianceEngine as string).slice(-4)}
              </a>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">---</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
