/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog';
import { handle } from 'frog/next';
import { base } from 'viem/chains';
import { resolveBasename } from '@/lib/basename';
import { buildAttestationRequest, EAS_ABI, EAS_CONTRACT_ADDRESS } from '@/lib/eas';
import { SKILL_OPTIONS, ENDORSEMENT_AMOUNT } from '@/lib/constants';

const app = new Frog({
    assetsPath: '/',
    basePath: '/api',
    title: 'Based Endorsements',
    imageAspectRatio: '1:1',
});

// Initial screen: Input basename and select skill
app.frame('/', (c) => {
    return c.res({
        image: (
            <div
                style={{
                    alignItems: 'center',
                    background: 'linear-gradient(to bottom right, #0052FF, #0041CC)',
                    backgroundSize: '100% 100%',
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'nowrap',
                    height: '100%',
                    justifyContent: 'center',
                    textAlign: 'center',
                    width: '100%',
                }}
            >
                <div
                    style={{
                        color: 'white',
                        fontSize: 60,
                        fontStyle: 'normal',
                        letterSpacing: '-0.025em',
                        lineHeight: 1.4,
                        marginTop: 30,
                        padding: '0 120px',
                        whiteSpace: 'pre-wrap',
                        fontWeight: 'bold',
                    }}
                >
                    ⭐ Based Endorsements
                </div>
                <div
                    style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: 32,
                        fontStyle: 'normal',
                        letterSpacing: '-0.025em',
                        lineHeight: 1.4,
                        marginTop: 20,
                        padding: '0 120px',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    Endorse a builder & boost their reputation on-chain
                </div>
                <div
                    style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: 24,
                        fontStyle: 'normal',
                        marginTop: 40,
                        padding: '0 120px',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    Enter their Basename below
                </div>
            </div>
        ),
        intents: [
            <TextInput placeholder="e.g., jesse or jesse.base.eth" />,
            <Button action="/select-skill">Next →</Button>,
        ],
    });
});

// Screen 2: Select skill
app.frame('/select-skill', (c) => {
    const { inputText } = c;

    if (!inputText) {
        return c.res({
            image: (
                <div style={{ color: 'white', display: 'flex', fontSize: 40, background: '#FF0000', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    ❌ Please enter a Basename
                </div>
            ),
            intents: [<Button action="/">Back</Button>],
        });
    }

    return c.res({
        image: (
            <div
                style={{
                    alignItems: 'center',
                    background: 'linear-gradient(to bottom right, #0052FF, #0041CC)',
                    backgroundSize: '100% 100%',
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'nowrap',
                    height: '100%',
                    justifyContent: 'center',
                    textAlign: 'center',
                    width: '100%',
                }}
            >
                <div
                    style={{
                        color: 'white',
                        fontSize: 48,
                        fontWeight: 'bold',
                        marginBottom: 30,
                    }}
                >
                    Endorsing: {inputText}
                </div>
                <div
                    style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: 32,
                        marginBottom: 40,
                    }}
                >
                    Select their superpower:
                </div>
            </div>
        ),
        intents: [
            <Button action={`/confirm?basename=${encodeURIComponent(inputText)}&skill=shipper`}>
                🚀 Shipper
            </Button>,
            <Button action={`/confirm?basename=${encodeURIComponent(inputText)}&skill=designer`}>
                🎨 Designer
            </Button>,
            <Button action={`/confirm?basename=${encodeURIComponent(inputText)}&skill=bigbrain`}>
                🧠 Big Brain
            </Button>,
            <Button action="/">← Back</Button>,
        ],
    });
});

// Screen 3: Confirm and display resolved address
app.frame('/confirm', async (c) => {
    const basename = c.req.query('basename') || '';
    const skill = c.req.query('skill') || '';

    if (!basename || !skill) {
        return c.res({
            image: (
                <div style={{ color: 'white', display: 'flex', fontSize: 40, background: '#FF0000', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    ❌ Missing information
                </div>
            ),
            intents: [<Button action="/">Start Over</Button>],
        });
    }

    // Resolve the basename to an address
    const resolvedAddress = await resolveBasename(basename);

    if (!resolvedAddress) {
        return c.res({
            image: (
                <div
                    style={{
                        alignItems: 'center',
                        background: 'linear-gradient(to bottom right, #FF4444, #CC0000)',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        justifyContent: 'center',
                        textAlign: 'center',
                        width: '100%',
                    }}
                >
                    <div style={{ color: 'white', fontSize: 48, fontWeight: 'bold' }}>
                        ❌ Basename Not Found
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 28, marginTop: 20 }}>
                        Could not resolve: {basename}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 24, marginTop: 20 }}>
                        Make sure they have a registered Basename
                    </div>
                </div>
            ),
            intents: [<Button action="/">Try Again</Button>],
        });
    }

    const skillLabel = SKILL_OPTIONS.find(s => s.value === skill)?.label || skill;

    return c.res({
        image: (
            <div
                style={{
                    alignItems: 'center',
                    background: 'linear-gradient(to bottom right, #00DD88, #00AA66)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'center',
                    textAlign: 'center',
                    width: '100%',
                    padding: '40px',
                }}
            >
                <div style={{ color: 'white', fontSize: 52, fontWeight: 'bold', marginBottom: 20 }}>
                    ✅ Ready to Endorse!
                </div>
                <div style={{ color: 'white', fontSize: 32, marginBottom: 15 }}>
                    {basename}
                </div>
                <div
                    style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: 22,
                        marginBottom: 30,
                        fontFamily: 'monospace',
                    }}
                >
                    {resolvedAddress}
                </div>
                <div style={{ color: 'white', fontSize: 36, marginBottom: 20 }}>
                    Skill: {skillLabel}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 24 }}>
                    Tip: 0.001 ETH + On-chain Attestation
                </div>
            </div>
        ),
        intents: [
            <Button.Transaction target={`/endorse?basename=${encodeURIComponent(basename)}&skill=${skill}&address=${resolvedAddress}`}>
                Endorse (0.001 ETH)
            </Button.Transaction>,
            <Button action="/">Cancel</Button>,
        ],
    });
});

// Transaction handler
app.transaction('/endorse', async (c) => {
    const address = c.req.query('address') as `0x${string}`;
    const skill = c.req.query('skill') || '';

    if (!address || !skill) {
        throw new Error('Missing address or skill');
    }

    // Build the attestation request
    const attestationRequest = buildAttestationRequest(address, skill);

    // Return transaction parameters
    return c.contract({
        abi: EAS_ABI,
        chainId: `eip155:${base.id}`,
        functionName: 'attest',
        args: [attestationRequest],
        to: EAS_CONTRACT_ADDRESS,
        value: ENDORSEMENT_AMOUNT, // Send 0.001 ETH with the transaction
    });
});

// Success screen
app.frame('/success', (c) => {
    return c.res({
        image: (
            <div
                style={{
                    alignItems: 'center',
                    background: 'linear-gradient(to bottom right, #8B5CF6, #6D28D9)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'center',
                    textAlign: 'center',
                    width: '100%',
                }}
            >
                <div style={{ color: 'white', fontSize: 60, fontWeight: 'bold', marginBottom: 30 }}>
                    🎉 Endorsed!
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 32 }}>
                    Your endorsement is now on-chain
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 24, marginTop: 20 }}>
                    Building reputation, one endorsement at a time
                </div>
            </div>
        ),
        intents: [
            <Button action="/">Endorse Another Builder</Button>,
            <Button.Link href="https://base.easscan.org">View on EASScan</Button.Link>,
        ],
    });
});

export const GET = handle(app);
export const POST = handle(app);
