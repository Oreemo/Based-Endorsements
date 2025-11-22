import { encodePacked, keccak256, encodeAbiParameters, parseAbiParameters } from 'viem';
import { EAS_CONTRACT_ADDRESS, ENDORSEMENT_SCHEMA_UID } from './constants';

// EAS Contract ABI - only the attest function
export const EAS_ABI = [
    {
        inputs: [
            {
                components: [
                    { name: 'schema', type: 'bytes32' },
                    {
                        components: [
                            { name: 'recipient', type: 'address' },
                            { name: 'expirationTime', type: 'uint64' },
                            { name: 'revocable', type: 'bool' },
                            { name: 'refUID', type: 'bytes32' },
                            { name: 'data', type: 'bytes' },
                            { name: 'value', type: 'uint256' },
                        ],
                        name: 'data',
                        type: 'tuple',
                    },
                ],
                name: 'request',
                type: 'tuple',
            },
        ],
        name: 'attest',
        outputs: [{ name: '', type: 'bytes32' }],
        stateMutability: 'payable',
        type: 'function',
    },
] as const;

/**
 * Build attestation data for an endorsement
 * @param skill - The skill being endorsed
 * @param comment - Optional comment (defaults to "Based endorsement!")
 * @returns Encoded data bytes
 */
export function buildAttestationData(skill: string, comment: string = 'Based endorsement!'): `0x${string}` {
    // Encode the data according to the schema: string skill, string comment
    const encodedData = encodeAbiParameters(
        parseAbiParameters('string skill, string comment'),
        [skill, comment]
    );

    return encodedData;
}

/**
 * Build the complete attestation request object
 * @param recipientAddress - The address being endorsed
 * @param skill - The skill being endorsed
 * @param comment - Optional comment
 * @returns Attestation request object
 */
export function buildAttestationRequest(
    recipientAddress: `0x${string}`,
    skill: string,
    comment: string = 'Based endorsement!'
) {
    const data = buildAttestationData(skill, comment);

    return {
        schema: ENDORSEMENT_SCHEMA_UID,
        data: {
            recipient: recipientAddress,
            expirationTime: BigInt(0), // No expiration
            revocable: true,
            refUID: '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
            data,
            value: BigInt(0), // No value in the attestation itself (we'll send ETH separately)
        },
    };
}

export { EAS_CONTRACT_ADDRESS };
