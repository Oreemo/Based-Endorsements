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

        console.log(`[Basename] Resolving with OnchainKit: ${fullName}`);

        // Use OnchainKit's getAddress function which returns address info
        // We pass chain as any to avoid strict viem version mismatch issues
        const result = await getAddress({ name: fullName, chain: base as any });

        console.log(`[Basename] OnchainKit result:`, result);

        if (result && result.address) {
            console.log(`[Basename] Resolved ${fullName} to:`, result.address);
            return result.address;
        }

        console.log(`[Basename] No address found for ${fullName}`);
        return null;
    } catch (error: any) {
        console.error('[Basename] Error resolving:', error);
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
