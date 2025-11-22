// Base Mainnet Chain Configuration
export const BASE_CHAIN_ID = 8453;

// EAS Contract on Base
export const EAS_CONTRACT_ADDRESS = '0x4200000000000000000000000000000000000021' as const;

// Schema UID for endorsements
export const ENDORSEMENT_SCHEMA_UID = '0xa1380ad137f38b38f91036b612e299ad6b8ebcc86713ff21e9083e1a82add984' as const;

// Transaction amount (0.001 ETH in wei)
export const ENDORSEMENT_AMOUNT = BigInt('1000000000000000'); // 0.001 ETH

// Skill options for endorsements
export const SKILL_OPTIONS = [
    { label: '🚀 Shipper', value: 'shipper' },
    { label: '🎨 Designer', value: 'designer' },
    { label: '🧠 Big Brain', value: 'bigbrain' },
] as const;

export type SkillType = typeof SKILL_OPTIONS[number]['value'];
