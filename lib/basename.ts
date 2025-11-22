import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const publicClient = createPublicClient({
    chain: base,
    transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'),
});

/**
 * Resolves a Basename to its Ethereum address
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

        console.log(`[Basename] Resolving: ${fullName}`);

        // Use viem's built-in ENS resolution
        // This works for Basenames because they use ENSIP-10 with CCIP gateway
        const address = await publicClient.getEnsAddress({
            name: fullName,
        });

        console.log(`[Basename] Resolved ${fullName} to:`, address);
        return address;
    } catch (error) {
        console.error('[Basename] Error resolving:', error);
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
