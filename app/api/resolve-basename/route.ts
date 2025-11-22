import { NextRequest, NextResponse } from 'next/server';
import { getAddress } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';
import { createPublicClient, http, namehash, parseAbi } from 'viem';

export const dynamic = 'force-dynamic';

// Create a public client with a reliable RPC
const publicClient = createPublicClient({
    chain: base,
    transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://base.llamarpc.com'),
});

const BASENAME_L2_RESOLVER_ADDRESS = '0xC6d566A56A1aFf6508b41f6c90ff131615583BCD'; // L2 Resolver

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');

    if (!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    let fullName = name.toLowerCase().trim();
    if (!fullName.endsWith('.base.eth')) {
        fullName = `${fullName}.base.eth`;
    }

    console.log(`[API] Resolving Basename: ${fullName}`);
    const logs: string[] = [];
    const addLog = (msg: string) => {
        console.log(`[API] ${msg}`);
        logs.push(msg);
    };

    try {
        // Method 1: OnchainKit
        addLog('Attempting Method 1: OnchainKit');
        try {
            const address = await getAddress({ name: fullName, chain: base as any });
            if (address) {
                addLog(`Method 1 success: ${address}`);
                return NextResponse.json({ address, method: 'onchainkit' });
            }
            addLog('Method 1 returned null');
        } catch (e: any) {
            addLog(`Method 1 failed: ${e.message}`);
        }

        // Method 2: Direct L2 Resolver Call
        addLog('Attempting Method 2: Direct L2 Resolver Call');
        try {
            const node = namehash(fullName);
            const address = await publicClient.readContract({
                address: BASENAME_L2_RESOLVER_ADDRESS,
                abi: parseAbi(['function addr(bytes32 node) view returns (address)']),
                functionName: 'addr',
                args: [node],
            });

            if (address && address !== '0x0000000000000000000000000000000000000000') {
                addLog(`Method 2 success: ${address}`);
                return NextResponse.json({ address, method: 'direct-resolver' });
            }
            addLog(`Method 2 returned zero address or null: ${address}`);
        } catch (e: any) {
            addLog(`Method 2 failed: ${e.message}`);
        }

        // Method 3: Viem getEnsAddress (Standard)
        addLog('Attempting Method 3: Viem getEnsAddress');
        try {
            const address = await publicClient.getEnsAddress({
                name: fullName,
            });
            if (address) {
                addLog(`Method 3 success: ${address}`);
                return NextResponse.json({ address, method: 'viem-ens' });
            }
            addLog('Method 3 returned null');
        } catch (e: any) {
            addLog(`Method 3 failed: ${e.message}`);
        }

        return NextResponse.json({
            error: 'Address not found',
            logs
        }, { status: 404 });

    } catch (error: any) {
        console.error('[API] Critical error resolving basename:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message,
            logs
        }, { status: 500 });
    }
}
