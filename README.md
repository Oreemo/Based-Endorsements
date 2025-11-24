# Base Endorsement

A Farcaster Mini App built on Base blockchain that allows users to endorse builders with on-chain attestations via EAS (Ethereum Attestation Service).

## Features

- 🎯 **Basename Resolution**: Resolves Basenames using CCIP-Read (supports wildcard resolution)
- ⛓️ **On-chain Attestations**: Creates permanent endorsement records using EAS on Base
- 🎨 **Beautiful UI**: Modern gradient-based design with intuitive multi-step flow
- 🚀 **Skills**: Endorse builders as Shippers, Designers, or Big Brains
- 📊 **Endorsement Tracking**: View endorsement counts broken down by skill type
- 🛡️ **Self-Endorsement Prevention**: Built-in checks to prevent users from endorsing themselves
- 📱 **Mobile Support**: Works in Farcaster, Chrome, Safari with multiple wallet connectors
- 🔢 **Raw Address Support**: Fallback to using 0x addresses directly if resolution fails

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Mini App**: Farcaster Frame SDK + Wagmi v2
- **Blockchain**: Base Mainnet (Chain ID: 8453)
- **Libraries**: 
  - `wagmi` v2 for wallet connections and transactions
  - `viem` for blockchain interactions
  - `@coinbase/onchainkit` for Basename utilities
  - `@farcaster/frame-sdk` for Mini App functionality
  - EAS for on-chain attestations

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A wallet app (Coinbase Wallet, MetaMask, or Farcaster)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
```

## How It Works

### User Flow

1. **Input Screen**: User enters a Basename (e.g., "jesse") or 0x address
2. **Skill Selection**: Choose the skill to endorse (Shipper/Designer/Big Brain)
3. **Confirmation**: View resolved address and confirm endorsement
4. **Connect Wallet**: If not connected, wallet connection is triggered
5. **Transaction**: Create EAS attestation on-chain
6. **Success**: View confirmation with link to EASScan

### On-chain Components

**EAS Contract**: `0x4200000000000000000000000000000000000021` (Base)  
**Schema UID**: `0xa1380ad137f38b38f91036b612e299ad6b8ebcc86713ff21e9083e1a82add984`  
**Schema**: `string skill, string comment`

### Basename Resolution

The app uses **CCIP-Read** (EIP-3668) to resolve Basenames:
- Queries Ethereum Mainnet ENS with CCIP-Read support
- Handles wildcard resolution for `*.base.eth` subdomains
- Falls back to direct 0x address input if resolution fails

## Testing

1. **Local Testing**: Run `npm run dev` and open in browser
2. **Farcaster Testing**: 
   - Deploy to production
   - Use [Warpcast Frame Validator](https://warpcast.com/~/developers/frames)
   - Share in a Warpcast cast
3. **Mobile Testing**: Test on mobile browsers with Coinbase Wallet or MetaMask

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

### Farcaster Mini App Listing

To appear in Warpcast's Mini Apps directory:
1. Ensure `public/.well-known/farcaster.json` is deployed
2. Visit [Warpcast Mini App Developer Tools](https://warpcast.com/~/developers/mini-apps)
3. Verify ownership of your domain
4. Mini App will be indexed automatically

## Project Structure

```
base-endorsement/
├── app/
│   ├── api/
│   │   ├── resolve-basename/     # Basename resolution API
│   │   └── get-endorsement-count/ # Endorsement stats API
│   ├── components/
│   │   ├── EndorsementFlow.tsx   # Main endorsement UI
│   │   ├── WagmiProvider.tsx     # Wagmi configuration
│   │   └── FarcasterProvider.tsx # Farcaster SDK wrapper
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
├── lib/
│   ├── basename.ts               # Basename utilities
│   ├── eas.ts                    # EAS attestation helpers
│   └── constants.ts              # Configuration constants
└── public/
    ├── icon.png                  # App icon
    └── .well-known/
        └── farcaster.json        # Mini App manifest
```

## Development

### Key Files

- **`app/components/EndorsementFlow.tsx`**: Main UI component with multi-step flow
- **`app/api/resolve-basename/route.ts`**: CCIP-Read basename resolution
- **`app/api/get-endorsement-count/route.ts`**: Fetch endorsement statistics
- **`lib/basename.ts`**: Client-side basename utilities
- **`lib/eas.ts`**: EAS attestation building and ABI
- **`lib/constants.ts`**: Base chain config, schema UID, and skill options

### Customization

- **Skills**: Edit `SKILL_OPTIONS` in `lib/constants.ts`
- **Schema**: Update `ENDORSEMENT_SCHEMA_UID` for custom schemas
- **Design**: Update styles in `app/globals.css` and `EndorsementFlow.tsx`
- **Wallet Connectors**: Modify `app/components/providers/WagmiProvider.tsx`

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT

## Resources

- [Farcaster Frame SDK](https://docs.farcaster.xyz/reference/frames/sdk)
- [Wagmi Documentation](https://wagmi.sh)
- [Base Documentation](https://docs.base.org)
- [EAS Documentation](https://docs.attest.sh)
- [OnchainKit](https://onchainkit.xyz)
- [CCIP-Read (EIP-3668)](https://eips.ethereum.org/EIPS/eip-3668)
