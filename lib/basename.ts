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

        // TODO: Implement proper Basename resolution via Base L2 resolver
        // For MVP, return a mock address to enable testing the UI flow
        // Basenames require L2 resolver contract interaction, not standard ENS

        // Mock resolution - return a valid address for testing
        // In production, this should query the Basename registry on Base L2
        const mockAddress = '0x1234567890123456789012345678901234567890';

        console.log(`Mock resolving ${fullName} to ${mockAddress}`);
        return mockAddress;

        // Original implementation (doesn't work for Base L2):
        // const address = await publicClient.getEnsAddress({
        //     name: fullName,
        // });
        // return address;
    } catch (error) {
        console.error('Error resolving Basename:', error);
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
