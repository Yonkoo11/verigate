"use client";

import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { parseUnits, isAddress, type Address, toHex } from "viem";
import {
  addresses,
  rwaTokenAbi,
  complianceEngineAbi,
  countryRestrictionAbi,
  BSC_TESTNET_EXPLORER,
} from "@/lib/contracts";
import { useToast } from "./Toast";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 mt-6 first:mt-0">
      {children}
    </h3>
  );
}

function TxLink({ hash }: { hash: string | undefined }) {
  if (!hash) return null;
  return (
    <a
      href={`${BSC_TESTNET_EXPLORER}/tx/${hash}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-[var(--accent-blue)] hover:underline font-mono"
    >
      {hash.slice(0, 10)}...{hash.slice(-8)}
    </a>
  );
}

function ActionButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2.5 text-sm font-medium rounded-[var(--radius-sm)] bg-[var(--accent-blue)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-[var(--duration-fast)] ease-out active:scale-[0.97]"
      style={{ minHeight: 44 }}
    >
      {children}
    </button>
  );
}

function InputField({
  id,
  label,
  value,
  onChange,
  placeholder,
  mono,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  mono?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-[var(--text-muted)] mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 text-sm rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-blue)] transition-colors duration-[var(--duration-fast)] ease-out ${mono ? "font-mono" : ""}`}
        style={{ fontSize: 16 }}
      />
    </div>
  );
}

export function IssuerPanel() {
  const { address } = useAccount();
  const { toast } = useToast();

  // Check ownership
  const { data: tokenOwner } = useReadContract({
    address: addresses.rwaToken,
    abi: rwaTokenAbi,
    functionName: "owner",
    query: { enabled: !!addresses.rwaToken },
  });

  const isOwner =
    !!address &&
    !!tokenOwner &&
    (address as string).toLowerCase() ===
      (tokenOwner as string).toLowerCase();

  // Mint state
  const [mintTo, setMintTo] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const {
    writeContract: writeMint,
    data: mintHash,
    isPending: mintPending,
  } = useWriteContract();

  // Attestation state
  const [attestWallet, setAttestWallet] = useState("");
  const [attestUID, setAttestUID] = useState("");
  const {
    writeContract: writeAttest,
    data: attestHash,
    isPending: attestPending,
  } = useWriteContract();

  // Freeze state
  const [freezeWallet, setFreezeWallet] = useState("");
  const {
    writeContract: writeFreeze,
    data: freezeHash,
    isPending: freezePending,
  } = useWriteContract();
  const {
    writeContract: writeUnfreeze,
    data: unfreezeHash,
    isPending: unfreezePending,
  } = useWriteContract();

  // Country state
  const [countryCode, setCountryCode] = useState("");
  const {
    writeContract: writeBlock,
    data: blockHash,
    isPending: blockPending,
  } = useWriteContract();
  const {
    writeContract: writeUnblock,
    data: unblockHash,
    isPending: unblockPending,
  } = useWriteContract();

  // Read blocked countries
  const { data: blockedCountries } = useReadContract({
    address: addresses.countryRestriction,
    abi: countryRestrictionAbi,
    functionName: "getBlockedCountries",
    query: { enabled: !!addresses.countryRestriction },
  });

  // Read modules
  const { data: modules } = useReadContract({
    address: addresses.complianceEngine,
    abi: complianceEngineAbi,
    functionName: "getModules",
    query: { enabled: !!addresses.complianceEngine },
  });

  const { data: decimals } = useReadContract({
    address: addresses.rwaToken,
    abi: rwaTokenAbi,
    functionName: "decimals",
  });

  const dec = typeof decimals === "number" ? decimals : 18;

  if (!isOwner) return null;

  function handleMint() {
    if (!isAddress(mintTo) || !mintAmount) return;
    writeMint(
      {
        address: addresses.rwaToken,
        abi: rwaTokenAbi,
        functionName: "mint",
        args: [mintTo as Address, parseUnits(mintAmount, dec)],
      },
      {
        onSuccess: () => toast("Mint tx submitted", "success"),
        onError: (e) => toast(e.message.split("\n")[0], "error"),
      }
    );
  }

  function handleSetAttestation() {
    if (!isAddress(attestWallet) || !attestUID) return;
    const uid = attestUID.startsWith("0x")
      ? (attestUID as `0x${string}`)
      : (`0x${attestUID}` as `0x${string}`);
    writeAttest(
      {
        address: addresses.complianceEngine,
        abi: complianceEngineAbi,
        functionName: "setAttestationUID",
        args: [attestWallet as Address, uid],
      },
      {
        onSuccess: () => toast("Attestation set", "success"),
        onError: (e) => toast(e.message.split("\n")[0], "error"),
      }
    );
  }

  function handleFreeze() {
    if (!isAddress(freezeWallet)) return;
    writeFreeze(
      {
        address: addresses.rwaToken,
        abi: rwaTokenAbi,
        functionName: "freezeAddress",
        args: [freezeWallet as Address],
      },
      {
        onSuccess: () => toast("Address frozen", "success"),
        onError: (e) => toast(e.message.split("\n")[0], "error"),
      }
    );
  }

  function handleUnfreeze() {
    if (!isAddress(freezeWallet)) return;
    writeUnfreeze(
      {
        address: addresses.rwaToken,
        abi: rwaTokenAbi,
        functionName: "unfreezeAddress",
        args: [freezeWallet as Address],
      },
      {
        onSuccess: () => toast("Address unfrozen", "success"),
        onError: (e) => toast(e.message.split("\n")[0], "error"),
      }
    );
  }

  function handleBlockCountry() {
    if (countryCode.length !== 2) return;
    const bytes2 = toHex(new TextEncoder().encode(countryCode.toUpperCase())) as `0x${string}`;
    writeBlock(
      {
        address: addresses.countryRestriction,
        abi: countryRestrictionAbi,
        functionName: "blockCountry",
        args: [bytes2],
      },
      {
        onSuccess: () => toast(`Country ${countryCode.toUpperCase()} blocked`, "success"),
        onError: (e) => toast(e.message.split("\n")[0], "error"),
      }
    );
  }

  function handleUnblockCountry() {
    if (countryCode.length !== 2) return;
    const bytes2 = toHex(new TextEncoder().encode(countryCode.toUpperCase())) as `0x${string}`;
    writeUnblock(
      {
        address: addresses.countryRestriction,
        abi: countryRestrictionAbi,
        functionName: "unblockCountry",
        args: [bytes2],
      },
      {
        onSuccess: () => toast(`Country ${countryCode.toUpperCase()} unblocked`, "success"),
        onError: (e) => toast(e.message.split("\n")[0], "error"),
      }
    );
  }

  function decodeCountryBytes(hex: string): string {
    try {
      const bytes = hex.startsWith("0x") ? hex.slice(2) : hex;
      const first = parseInt(bytes.slice(0, 2), 16);
      const second = parseInt(bytes.slice(2, 4), 16);
      return String.fromCharCode(first) + String.fromCharCode(second);
    } catch {
      return hex;
    }
  }

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--accent-purple)]/30 bg-[var(--bg-card)] p-6">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-lg font-semibold">Issuer Admin</h2>
        <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-[var(--radius-sm)] bg-[var(--accent-purple)]/15 text-[var(--accent-purple)] border border-[var(--accent-purple)]/30">
          Owner
        </span>
      </div>

      {/* Mint Tokens */}
      <SectionTitle>Mint Tokens</SectionTitle>
      <div className="space-y-3">
        <InputField
          id="mint-to"
          label="Recipient"
          value={mintTo}
          onChange={setMintTo}
          placeholder="0x..."
          mono
        />
        <InputField
          id="mint-amount"
          label="Amount"
          value={mintAmount}
          onChange={(v) => setMintAmount(v.replace(/[^0-9.]/g, ""))}
          placeholder="1000"
        />
        <div className="flex items-center gap-3">
          <ActionButton
            onClick={handleMint}
            disabled={!isAddress(mintTo) || !mintAmount || mintPending}
          >
            {mintPending ? "Minting..." : "Mint"}
          </ActionButton>
          <TxLink hash={mintHash} />
        </div>
      </div>

      {/* Set Attestation UID */}
      <SectionTitle>Set Attestation UID</SectionTitle>
      <div className="space-y-3">
        <InputField
          id="attest-wallet"
          label="Wallet Address"
          value={attestWallet}
          onChange={setAttestWallet}
          placeholder="0x..."
          mono
        />
        <InputField
          id="attest-uid"
          label="Attestation UID (bytes32)"
          value={attestUID}
          onChange={setAttestUID}
          placeholder="0x..."
          mono
        />
        <div className="flex items-center gap-3">
          <ActionButton
            onClick={handleSetAttestation}
            disabled={
              !isAddress(attestWallet) || !attestUID || attestPending
            }
          >
            {attestPending ? "Setting..." : "Set Attestation"}
          </ActionButton>
          <TxLink hash={attestHash} />
        </div>
      </div>

      {/* Freeze/Unfreeze */}
      <SectionTitle>Freeze / Unfreeze Address</SectionTitle>
      <div className="space-y-3">
        <InputField
          id="freeze-wallet"
          label="Wallet Address"
          value={freezeWallet}
          onChange={setFreezeWallet}
          placeholder="0x..."
          mono
        />
        <div className="flex items-center gap-3">
          <ActionButton
            onClick={handleFreeze}
            disabled={!isAddress(freezeWallet) || freezePending}
          >
            {freezePending ? "Freezing..." : "Freeze"}
          </ActionButton>
          <ActionButton
            onClick={handleUnfreeze}
            disabled={!isAddress(freezeWallet) || unfreezePending}
          >
            {unfreezePending ? "Unfreezing..." : "Unfreeze"}
          </ActionButton>
          <TxLink hash={freezeHash || unfreezeHash} />
        </div>
      </div>

      {/* Country Restriction */}
      {addresses.countryRestriction && (
        <>
          <SectionTitle>Country Restrictions</SectionTitle>
          <div className="space-y-3">
            <InputField
              id="country-code"
              label="Country Code (e.g. US, KP)"
              value={countryCode}
              onChange={(v) => setCountryCode(v.toUpperCase().slice(0, 2))}
              placeholder="US"
            />
            <div className="flex items-center gap-3">
              <ActionButton
                onClick={handleBlockCountry}
                disabled={countryCode.length !== 2 || blockPending}
              >
                {blockPending ? "Blocking..." : "Block"}
              </ActionButton>
              <ActionButton
                onClick={handleUnblockCountry}
                disabled={countryCode.length !== 2 || unblockPending}
              >
                {unblockPending ? "Unblocking..." : "Unblock"}
              </ActionButton>
              <TxLink hash={blockHash || unblockHash} />
            </div>

            {Array.isArray(blockedCountries) && blockedCountries.length > 0 ? (
              <div className="mt-2">
                <p className="text-xs text-[var(--text-muted)] mb-1.5">
                  Blocked Countries
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(blockedCountries as string[]).map((c: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs font-mono rounded-[var(--radius-sm)] bg-[var(--accent-red)]/10 text-[var(--accent-red)] border border-[var(--accent-red)]/20"
                    >
                      {decodeCountryBytes(c)}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}

      {/* Registered Modules */}
      <SectionTitle>Compliance Modules</SectionTitle>
      {modules && (modules as string[]).length > 0 ? (
        <div className="space-y-1.5">
          {(modules as string[]).map((mod, i) => (
            <div
              key={i}
              className="flex items-center gap-2 py-1.5 px-3 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border-primary)]"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" />
              <a
                href={`${BSC_TESTNET_EXPLORER}/address/${mod}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-[var(--accent-blue)] hover:underline"
              >
                {mod}
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[var(--text-muted)]">No modules registered</p>
      )}
    </div>
  );
}
