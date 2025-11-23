import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

export const dynamic = 'force-dynamic';

// Create a client on Ethereum Mainnet for ENS resolution
// Basenames use CCIP-Read, so we need to resolve through L1
const mainnetClient = createPublicClient({
    chain: mainnet,
    transport: http('https://eth.llamarpc.com'),
});

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
        // Use Ethereum Mainnet's ENS Universal Resolver with CCIP-Read support
        // This will properly handle Basenames which use wildcard resolution + CCIP-Read
        addLog('Attempting resolution via Ethereum Mainnet ENS (CCIP-Read)');

        const address = await mainnetClient.getEnsAddress({
            name: fullName,
        });

        if (address) {
            addLog(`Successfully resolved via CCIP-Read: ${address}`);
            return NextResponse.json({ address, method: 'mainnet-ens-ccip' });
        }

        addLog('Resolution returned null');
        return NextResponse.json({
            error: 'Address not found',
            logs
        }, { status: 404 });

    } catch (error: any) {
        addLog(`Error: ${error.message}`);
        console.error('[API] Critical error resolving basename:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message,
            logs
        }, { status: 500 });
    }
}
