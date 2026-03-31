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
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
        {wrongChain && (
          <button
            onClick={() => switchChain({ chainId: bscTestnet.id })}
            style={{
              fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500,
              color: "var(--black)", background: "#f59e0b", border: "none",
              padding: "8px 14px", cursor: "pointer", minHeight: 40,
            }}
          >
            Switch Network
          </button>
        )}
        <div style={{
          display: "flex", alignItems: "center", gap: "var(--sp-2)",
          fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-2)",
          background: "var(--surface-2)", border: "1px solid var(--border)",
          padding: "8px 14px", minHeight: 40,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <button
          onClick={() => disconnect()}
          style={{
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500,
            color: "var(--text-3)", background: "transparent",
            border: "1px solid var(--border)", padding: "8px 14px",
            cursor: "pointer", minHeight: 40,
            transition: "color var(--duration) var(--ease), border-color var(--duration) var(--ease)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.borderColor = "var(--red-border)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-3)"; e.currentTarget.style.borderColor = "var(--border)"; }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  if (connectors.length === 0) {
    return (
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-3)", padding: "8px 14px", border: "1px solid var(--border)" }}>
        No wallet detected
      </span>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      disabled={isPending}
      style={{
        fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500,
        color: "var(--black)", background: "var(--amber)", border: "none",
        padding: "10px 20px", cursor: isPending ? "not-allowed" : "pointer",
        opacity: isPending ? 0.5 : 1, minHeight: 44,
        transition: "opacity var(--duration) var(--ease)",
      }}
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
