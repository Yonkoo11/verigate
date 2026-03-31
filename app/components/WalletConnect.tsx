"use client";

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { bscTestnet } from "wagmi/chains";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const wrongChain = isConnected && chainId !== bscTestnet.id;

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        {wrongChain && (
          <button
            onClick={() => switchChain({ chainId: bscTestnet.id })}
            className="px-3 py-2 text-sm font-medium rounded-[var(--radius-sm)] bg-[var(--accent-amber)] text-black hover:opacity-90 transition-opacity duration-[var(--duration-fast)] ease-out"
            style={{ minHeight: 44 }}
          >
            Switch to BSC Testnet
          </button>
        )}
        <div className="px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-card)] border border-[var(--border-primary)] text-sm text-[var(--text-secondary)]">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <button
          onClick={() => disconnect()}
          className="px-3 py-2 text-sm font-medium rounded-[var(--radius-sm)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-red)] transition-colors duration-[var(--duration-fast)] ease-out active:scale-[0.97]"
          style={{ minHeight: 44 }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      disabled={isPending}
      className="px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)] bg-[var(--accent-blue)] text-white hover:opacity-90 transition-opacity duration-[var(--duration-fast)] ease-out disabled:opacity-50 active:scale-[0.97]"
      style={{ minHeight: 44 }}
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
