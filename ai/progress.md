# Verigate — Progress

## Status: PHASE 1 GATE PASSED. Deployed and verified on BSC testnet.

## Deployed Contracts (BSC Testnet, Chain 97)
- **RWATokenFactory:** `0xf35bE6FFEBF91AcC27A78696cf912595C6b08AAA`
- **RWAToken (rwGATE):** `0xfb2E49727D99F4A46a5BBa3D1C7B0522c081Aae8`
- **ComplianceEngine:** `0xE5fe2B794E4C1370217e0269F124BaB39f9bbd51`
- **CountryRestriction:** `0x8259e22A83e22B59Bf224709a96832c3Ce5121B4`
- **AccreditedInvestor:** `0x65871B81EfbfB9D99A7DeA2f1436c25A35af6D46`
- **MaxHolders:** `0x7962848AA6187151DF77F845d5b05262BF86b66a`
- **BAS Schema UID:** `0xa72370606965bcdb25a1930828933a52fdcb9c2c59742c2806b5af35d4e87989`
- **Deployer:** `0xf9946775891a24462cD4ec885d0D4E2675C84355`

## Phase 1 Gate: PASSED
- Transfer without attestation → Reverted (CountryRestriction: sender has no attestation)
- BAS schema registered → Success
- BAS attestations created for deployer (US, accredited) and test recipient (GB, accredited)
- Transfer with attestations → Success (1 rwGATE transferred)

## What's Done
- [x] 7 Solidity contracts + 3 interfaces
- [x] 75 passing tests
- [x] 4 bugs found and fixed via manual audit
- [x] Slither static analysis clean
- [x] Deployed to BSC testnet
- [x] BAS schema registered on testnet
- [x] BAS attestations created and mapped
- [x] Phase 1 Gate verified on-chain
- [x] Next.js frontend built (wagmi/viem)
- [x] Frontend .env.local configured with deployed addresses

## What's Done Since Last Update
- [x] RWATokenFactory verified on BSCScan
- [x] README with architecture, contract addresses, setup instructions
- [x] Git repo initialized, committed, pushed to https://github.com/Yonkoo11/rwa-gateway
- [x] .env.example files for contracts and frontend
- [x] No secrets in git (verified)

## What's NOT Done
- [ ] Pitch deck
- [ ] DoraHacks BUIDL page + Google Form submission
- [ ] Demo video
- [ ] Frontend live testing (dev server starts clean, not browser-tested)

## Next Steps
1. Build pitch deck
2. Submit to DoraHacks
3. Test frontend in browser
