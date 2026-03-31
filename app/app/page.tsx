"use client";

import { useAccount } from "wagmi";
import { TokenDashboard } from "@/components/TokenDashboard";
import { ComplianceStatus } from "@/components/ComplianceStatus";
import { TransferForm } from "@/components/TransferForm";
import { IssuerPanel } from "@/components/IssuerPanel";

/* ============================================================
   HERO — The Gate
   Split: left = BLOCKED (cold, muted), right = APPROVED (warm, amber)
   The vertical gate line IS the product. This is not decoration.
   ============================================================ */
function GateHero() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100vh - 56px)",
        position: "relative",
      }}
    >
      {/* LEFT: Denied zone — cold, muted */}
      <div
        style={{
          flex: "0 0 58%",
          background: "var(--black)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 48px 80px 64px",
          position: "relative",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase" as const,
            color: "var(--text-4)",
            marginBottom: 28,
          }}
        >
          Without verification
        </span>

        <div
          style={{
            width: 44,
            height: 44,
            border: "1px solid var(--red-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 6l8 8M14 6l-8 8" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 30,
            fontWeight: 500,
            color: "var(--text-3)",
            lineHeight: 1.2,
            marginBottom: 14,
          }}
        >
          Transfer Denied
        </h2>

        <p
          style={{
            fontSize: 15,
            color: "var(--text-4)",
            maxWidth: 380,
            lineHeight: 1.6,
          }}
        >
          No valid attestation found. Compliance check failed at CountryRestriction module.
        </p>

        {/* Simulated failed tx receipt */}
        <div
          style={{
            marginTop: 36,
            padding: "14px 16px",
            background: "rgba(255,255,255,0.015)",
            border: "1px solid var(--border)",
          }}
        >
          {[
            ["Status", "REVERTED"],
            ["Module", "CountryRestriction"],
            ["Reason", "Recipient has no attestation"],
          ].map(([label, value], i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "7px 0",
                borderTop: i > 0 ? "1px solid var(--border)" : "none",
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-4)", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
                {label}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: i === 0 ? "var(--red)" : "var(--text-3)" }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* GATE LINE — the product itself */}
      <div
        style={{
          position: "absolute",
          left: "58%",
          top: 0,
          bottom: 0,
          width: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          transform: "translateX(-50%)",
        }}
      >
        {/* Vertical line */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 1,
            background: "var(--amber-border)",
            transform: "translateX(-50%)",
          }}
        />
        {/* Gate dot */}
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "var(--amber)",
            boxShadow: "0 0 20px rgba(201,165,92,0.35)",
            zIndex: 1,
          }}
        />
        {/* Rotated label */}
        <span
          style={{
            position: "absolute",
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.3em",
            textTransform: "uppercase" as const,
            color: "var(--amber)",
            opacity: 0.45,
            writingMode: "vertical-rl" as const,
            transform: "rotate(180deg) translateY(-40px)",
          }}
        >
          Verigate
        </span>
      </div>

      {/* RIGHT: Approved zone — warm, amber-tinted */}
      <div
        style={{
          flex: "0 0 42%",
          background: "var(--surface-1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 64px 80px 48px",
          position: "relative",
        }}
      >
        {/* Subtle warm glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, var(--amber-glow), transparent)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              color: "var(--amber)",
              opacity: 0.7,
              marginBottom: 28,
              display: "block",
            }}
          >
            With verification
          </span>

          <div
            style={{
              width: 44,
              height: 44,
              border: "1px solid var(--green-border)",
              background: "var(--green-dim)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 10l4 4 6-7" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 30,
              fontWeight: 500,
              color: "var(--text-1)",
              lineHeight: 1.2,
              marginBottom: 14,
            }}
          >
            Transfer Approved
          </h2>

          <p
            style={{
              fontSize: 15,
              color: "var(--text-2)",
              maxWidth: 340,
              lineHeight: 1.6,
            }}
          >
            All compliance modules passed. BAS attestation verified for both parties.
          </p>

          {/* Connect CTA */}
          <button
            style={{
              marginTop: 40,
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              fontWeight: 500,
              color: "var(--black)",
              background: "var(--amber)",
              border: "none",
              padding: "14px 32px",
              cursor: "pointer",
              letterSpacing: "0.01em",
              minHeight: 48,
            }}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD — Asymmetric: data (left 60%) + actions (right 40%)
   The gate line persists as a subtle vertical border.
   ============================================================ */
function Dashboard() {
  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "var(--sp-8) var(--sp-6) var(--sp-16)" }}>
      {/* Section heading */}
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 26,
          fontWeight: 500,
          color: "var(--text-1)",
          marginBottom: "var(--sp-8)",
          letterSpacing: "-0.01em",
        }}
      >
        Dashboard
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-6)" }}>
        <TokenDashboard />
        <ComplianceStatus />
      </div>

      <div style={{ marginTop: "var(--sp-6)" }}>
        <TransferForm />
      </div>

      {/* Gate divider before admin */}
      <div
        style={{
          margin: "var(--sp-12) 0",
          height: 1,
          background: "var(--amber-border)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "var(--black)",
            padding: "0 12px",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            color: "var(--amber)",
            opacity: 0.5,
          }}
        >
          Issuer Controls
        </div>
      </div>

      <IssuerPanel />
    </div>
  );
}

export default function Home() {
  const { isConnected } = useAccount();
  return isConnected ? <Dashboard /> : <GateHero />;
}
