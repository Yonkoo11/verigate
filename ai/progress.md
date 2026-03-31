# Verigate — Progress

## Status: PHASE 1 GATE PASSED. Deployed and verified on BSC testnet.

## Deployed Contracts (BSC Testnet, Chain 97) — v2 (Verigate rebrand)
- **RWATokenFactory:** `0x60aa769416EfBbc0A6BC9cb454758dE6f76D52B5` (verified on BSCScan)
- **RWAToken (VGATE):** `0xE7f32bcBCDBBEf25900d5f9545C20CFC2d61A711`
- **ComplianceEngine:** `0x5Bf71EEdA3CA10ae52de3eA4aeA4b14b9d0FDba7`
- **CountryRestriction:** `0x742D04D05f303Cb95E805Fb6B8A6C5035e6c41f8`
- **AccreditedInvestor:** `0x77C3c50106c84585d6242Cb44876aDE3a445ED26`
- **MaxHolders:** `0xE5c8383bBDbf1767D285e12eAAB32038Fe6A1424`
- **BAS Schema UID:** `0xa72370606965bcdb25a1930828933a52fdcb9c2c59742c2806b5af35d4e87989`
- **Deployer:** `0xf9946775891a24462cD4ec885d0D4E2675C84355`
- **Live Demo:** https://yonkoo11.github.io/verigate/

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
