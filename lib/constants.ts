// Base Mainnet Chain Configuration
export const BASE_CHAIN_ID = 8453;

// EAS Contract on Base
export const EAS_CONTRACT_ADDRESS = '0x4200000000000000000000000000000000000021' as const;

// Schema UID for endorsements (rating schema as placeholder)
export const ENDORSEMENT_SCHEMA_UID = '0x3b5463335a023f89382e6264f896738b333052803146193990964d61c2180c2d' as const;

// Transaction amount (0.001 ETH in wei)
export const ENDORSEMENT_AMOUNT = BigInt('1000000000000000'); // 0.001 ETH

// Skill options for endorsements
export const SKILL_OPTIONS = [
    { label: '🚀 Shipper', value: 'shipper' },
    { label: '🎨 Designer', value: 'designer' },
    { label: '🧠 Big Brain', value: 'bigbrain' },
] as const;

export type SkillType = typeof SKILL_OPTIONS[number]['value'];
