# Verigate

Lightweight, BNB-native compliance middleware for tokenized real-world assets. Uses [BAS (BNB Attestation Service)](https://www.bnbattest.io/) for identity verification and modular compliance rules.

## How It Works

Every transfer of an RWA token is checked against a **ComplianceEngine** that iterates registered modules. Each module reads the sender/recipient's **BAS attestation** to verify compliance (country restrictions, accredited investor status, holder caps).

```
Transfer → ComplianceEngine → [CountryRestriction] → [AccreditedInvestor] → [MaxHolders] → Allowed/Blocked
                                      ↓                       ↓                    ↓
                                  BAS Attestation         BAS Attestation     Holder Count
```

**No attestation = no transfer.** The issuer maps wallet addresses to BAS attestation UIDs. KYC providers (Sumsub, Blockpass — already BAS partners) issue the attestations.

## Deployed Contracts (BSC Testnet)

| Contract | Address |
|----------|---------|
| RWATokenFactory | [`0xf35bE6...08AAA`](https://testnet.bscscan.com/address/0xf35bE6FFEBF91AcC27A78696cf912595C6b08AAA) |
| RWAToken (rwGATE) | [`0xfb2E49...Aae8`](https://testnet.bscscan.com/address/0xfb2E49727D99F4A46a5BBa3D1C7B0522c081Aae8) |
| ComplianceEngine | [`0xE5fe2B...bd51`](https://testnet.bscscan.com/address/0xE5fe2B794E4C1370217e0269F124BaB39f9bbd51) |
| CountryRestriction | [`0x8259e2...21B4`](https://testnet.bscscan.com/address/0x8259e22A83e22B59Bf224709a96832c3Ce5121B4) |
| AccreditedInvestor | [`0x65871B...f46`](https://testnet.bscscan.com/address/0x65871B81EfbfB9D99A7DeA2f1436c25A35af6D46) |
| MaxHolders | [`0x796284...b66a`](https://testnet.bscscan.com/address/0x7962848AA6187151DF77F845d5b05262BF86b66a) |

BAS Schema UID: `0xa72370606965bcdb25a1930828933a52fdcb9c2c59742c2806b5af35d4e87989`

## Architecture

```
contracts/
├── src/
│   ├── interfaces/
│   │   ├── IBAS.sol              # BAS interface (EAS-compatible)
│   │   └── IComplianceModule.sol # Module interface
│   ├── modules/
│   │   ├── CountryRestriction.sol  # Block sanctioned jurisdictions
│   │   ├── AccreditedInvestor.sol  # Require accredited status
│   │   └── MaxHolders.sol          # Cap holder count (SEC 12g-1)
│   ├── ComplianceEngine.sol  # Modular rule engine + BAS attestation mapping
│   ├── RWAToken.sol          # ERC-20 with compliance hooks
│   └── RWATokenFactory.sol   # One-tx deployment with all modules
├── test/                     # 75 tests
└── script/                   # Foundry deploy scripts

app/                          # Next.js frontend (wagmi + viem)
```

## Smart Contract Design

**RWAToken** — Standard ERC-20 with a compliance hook in `_update()`. Every transfer (except mint/burn) calls `ComplianceEngine.canTransfer()`. The issuer can pause, freeze addresses, and force-transfer for regulatory recovery.

**ComplianceEngine** — Iterates registered `IComplianceModule` contracts. Maps wallet addresses to BAS attestation UIDs. Modules read attestation data to enforce rules.

**Modules** — Each implements `checkCompliance()`:
- **CountryRestriction** — Decodes country code from BAS attestation, checks against blocklist. Optionally checks sender too.
- **AccreditedInvestor** — Verifies accredited status from BAS attestation. Configurable to check sender, recipient, or both.
- **MaxHolders** — Tracks distinct holder count, blocks transfers that would exceed the cap.

**RWATokenFactory** — Deploys token + engine + selected modules in one transaction. Configures modules and transfers ownership to the issuer.

## Running Locally

### Contracts

```bash
cd contracts
forge install
forge test    # 75 tests
```

### Frontend

```bash
cd app
bun install
cp .env.example.local .env.local   # Already populated with BSC testnet addresses
bun run dev
```

Open http://localhost:3000, connect MetaMask to BSC Testnet.

## BAS Integration

The compliance schema: `uint8 kycLevel, bytes2 country, bool accredited, uint8 investorType, uint64 expiry`

Attestations are created by KYC providers on BAS, then mapped to wallet addresses by the token issuer via `ComplianceEngine.setAttestationUID()`.

BAS contracts (BSC Testnet):
- BAS: `0x6c2270298b1e6046898a322acB3Cbad6F99f7CBD`
- Schema Registry: `0x08C8b8417313fF130526862f90cd822B55002D72`

## Tech Stack

- Solidity 0.8.24 + Foundry
- OpenZeppelin Contracts
- BNB Attestation Service (BAS)
- Next.js 14 + wagmi v2 + viem
- Tailwind CSS
