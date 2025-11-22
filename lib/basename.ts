import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { getAddress } from '@coinbase/onchainkit/identity';

const publicClient = createPublicClient({
    chain: base,
    transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'),
});

/**
 * Resolves a Basename to its Ethereum address using OnchainKit
 * @param name - The basename (e.g., "jesse" or "jesse.base.eth")
 * @returns The resolved 0x address or null if not found
 */
export async function resolveBasename(name: string): Promise<string | null> {
    try {
        // Normalize the name - add .base.eth if not present
        let fullName = name.toLowerCase().trim();
        if (!fullName.endsWith('.base.eth')) {
            fullName = `${fullName}.base.eth`;
        }
        console.error('[Basename] Error type:', error?.constructor?.name);
        console.error('[Basename] Error message:', error?.message);
        console.error('[Basename] Error details:', JSON.stringify(error, null, 2));
        return null;
    }
}

/**
 * Get avatar URL for a given address using Basename
 * @param name - The basename
 * @returns Avatar URL or null
 */
export async function getBasenameAvatar(name: string): Promise<string | null> {
    try {
        let fullName = name.toLowerCase().trim();
        if (!fullName.endsWith('.base.eth')) {
            fullName = `${fullName}.base.eth`;
        }

        const avatar = await publicClient.getEnsAvatar({
            name: fullName,
        });

        return avatar;
    } catch (error) {
        console.error('Error getting Basename avatar:', error);
        return null;
    }
}
