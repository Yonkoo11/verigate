"use client";

import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits, isAddress, type Address } from "viem";
import {
  addresses,
  rwaTokenAbi,
  complianceEngineAbi,
  BSC_TESTNET_EXPLORER,
} from "@/lib/contracts";
import { useToast } from "./Toast";

export function TransferForm() {
  const { address } = useAccount();
  const { toast } = useToast();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [preCheckResult, setPreCheckResult] = useState<{
    compliant: boolean;
    reason: string;
  } | null>(null);
  const [checking, setChecking] = useState(false);

  const { data: decimals } = useReadContract({
    address: addresses.rwaToken,
    abi: rwaTokenAbi,
    functionName: "decimals",
  });

  const dec = typeof decimals === "number" ? decimals : 18;

  // Compliance pre-check (read-only call)
  const {
    refetch: checkCompliance,
    isFetching: isChecking,
  } = useReadContract({
    address: addresses.complianceEngine,
    abi: complianceEngineAbi,
    functionName: "canTransfer",
    args:
      address && isAddress(recipient) && amount
        ? [address, recipient as Address, parseUnits(amount, dec)]
        : undefined,
    query: { enabled: false },
  });

  const {
    writeContract,
    data: txHash,
    isPending: isSending,
    error: sendError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  async function handlePreCheck() {
    if (!address || !isAddress(recipient) || !amount) return;
    setChecking(true);
    setPreCheckResult(null);
    try {
      const result = await checkCompliance();
      if (result.data) {
        const [compliant, reason] = result.data as [boolean, string];
        setPreCheckResult({ compliant, reason });
      }
    } catch {
      setPreCheckResult({ compliant: false, reason: "Pre-check call failed" });
    }
    setChecking(false);
  }

  function handleTransfer() {
    if (!address || !isAddress(recipient) || !amount) return;
    try {
      writeContract(
        {
          address: addresses.rwaToken,
          abi: rwaTokenAbi,
          functionName: "transfer",
          args: [recipient as Address, parseUnits(amount, dec)],
        },
        {
          onSuccess: () => {
            toast("Transfer submitted", "success");
          },
          onError: (err) => {
            toast(err.message.split("\n")[0], "error");
          },
        }
      );
    } catch {
      toast("Transfer failed", "error");
    }
  }

  const validInput = isAddress(recipient) && parseFloat(amount) > 0;

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-primary)] bg-[var(--bg-card)] p-6">
      <h2 className="text-lg font-semibold mb-4">Transfer Tokens</h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="recipient"
            className="block text-xs text-[var(--text-muted)] mb-1.5"
          >
            Recipient Address
          </label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => {
              setRecipient(e.target.value);
              setPreCheckResult(null);
            }}
            placeholder="0x..."
            className="w-full px-3 py-2.5 text-sm font-mono rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-blue)] transition-colors duration-[var(--duration-fast)] ease-out"
            style={{ fontSize: 16 }}
          />
          {recipient && !isAddress(recipient) && (
            <p className="text-xs text-[var(--accent-red)] mt-1">
              Invalid address format
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-xs text-[var(--text-muted)] mb-1.5"
          >
            Amount
          </label>
          <input
            id="amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9.]/g, "");
              setAmount(v);
              setPreCheckResult(null);
            }}
            placeholder="0.00"
            className="w-full px-3 py-2.5 text-sm rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] tabular-nums focus:border-[var(--accent-blue)] transition-colors duration-[var(--duration-fast)] ease-out"
            style={{ fontSize: 16 }}
          />
        </div>

        {/* Pre-check result */}
        {preCheckResult && (
          <div
            className={`p-3 rounded-[var(--radius-sm)] border text-sm ${
              preCheckResult.compliant
                ? "bg-[#0f2e1a] border-[var(--accent-green)]/30 text-[var(--accent-green)]"
                : "bg-[#2e0f0f] border-[var(--accent-red)]/30 text-[var(--accent-red)]"
            }`}
          >
            <div className="flex items-center gap-2">
              {preCheckResult.compliant ? (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M5 8l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M5.5 5.5l5 5M10.5 5.5l-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              <span>
                {preCheckResult.compliant
                  ? "Transfer is compliant"
                  : `Blocked: ${preCheckResult.reason || "Compliance check failed"}`}
              </span>
            </div>
          </div>
        )}

        {/* Transaction status */}
        {txHash && (
          <div className="p-3 rounded-[var(--radius-sm)] border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-sm">
            <p className="text-[var(--text-secondary)]">
              {isConfirming
                ? "Confirming..."
                : isConfirmed
                  ? "Transfer confirmed"
                  : "Transaction submitted"}
            </p>
            <a
              href={`${BSC_TESTNET_EXPLORER}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--accent-blue)] hover:underline font-mono mt-1 inline-block"
            >
              {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </a>
          </div>
        )}

        {sendError && (
          <div className="p-3 rounded-[var(--radius-sm)] border border-[var(--accent-red)]/30 bg-[#2e0f0f] text-sm text-[var(--accent-red)]">
            {sendError.message.split("\n")[0]}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handlePreCheck}
            disabled={!validInput || checking || isChecking}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-[var(--radius-sm)] border border-[var(--accent-blue)] text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-[var(--duration-fast)] ease-out active:scale-[0.97]"
            style={{ minHeight: 44 }}
          >
            {checking || isChecking ? "Checking..." : "Pre-Check Compliance"}
          </button>
          <button
            onClick={handleTransfer}
            disabled={!validInput || isSending || isConfirming}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-[var(--radius-sm)] bg-[var(--accent-blue)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-[var(--duration-fast)] ease-out active:scale-[0.97]"
            style={{ minHeight: 44 }}
          >
            {isSending
              ? "Sending..."
              : isConfirming
                ? "Confirming..."
                : "Transfer"}
          </button>
        </div>
      </div>
    </div>
  );
}
