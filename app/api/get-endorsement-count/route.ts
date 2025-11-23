import { NextRequest, NextResponse } from 'next/server';
import { ENDORSEMENT_SCHEMA_UID } from '@/lib/constants';
import { decodeAbiParameters, parseAbiParameters } from 'viem';

const EAS_GRAPHQL_ENDPOINT = 'https://base.easscan.org/graphql';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');

    if (!address) {
        return NextResponse.json(
            { error: 'Address parameter is required' },
            { status: 400 }
        );
    }

    try {
        // GraphQL query to get attestations with their data
        const query = `
            query GetEndorsements($recipient: String!, $schemaId: String!) {
                attestations(
                    where: {
                        schemaId: { equals: $schemaId }
                        recipient: { equals: $recipient }
                        revoked: { equals: false }
                    }
                ) {
                    id
                    data
                    decodedDataJson
                }
            }
        `;

        const response = await fetch(EAS_GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: {
                    recipient: address.toLowerCase(),
                    schemaId: ENDORSEMENT_SCHEMA_UID,
                },
            }),
        });

        if (!response.ok) {
            console.error('EAS GraphQL request failed:', response.status);
            return NextResponse.json(
                { total: 0, bySkill: {} },
                { status: 200 }
            );
        }

        const data = await response.json();

        if (data.errors) {
            console.error('GraphQL errors:', data.errors);
            return NextResponse.json(
                { total: 0, bySkill: {} },
                { status: 200 }
            );
        }

        const attestations = data.data?.attestations || [];

        // Count by skill type
        const bySkill: Record<string, number> = {};

        for (const attestation of attestations) {
            try {
                // Try using decodedDataJson first
                if (attestation.decodedDataJson) {
                    const decoded = JSON.parse(attestation.decodedDataJson);
                    const skillField = decoded.find((field: any) => field.name === 'skill');
                    if (skillField && skillField.value && skillField.value.value) {
                        const skill = skillField.value.value;
                        bySkill[skill] = (bySkill[skill] || 0) + 1;
                    }
                } else if (attestation.data) {
                    // Fallback to manual decoding
                    // Schema: string skill
                    const decoded = decodeAbiParameters(
                        parseAbiParameters('string skill'),
                        attestation.data as `0x${string}`
                    );
                    const skill = decoded[0];
                    bySkill[skill] = (bySkill[skill] || 0) + 1;
                }
            } catch (err) {
                console.error('Error decoding attestation:', err);
            }
        }

        const total = attestations.length;

        return NextResponse.json({ total, bySkill });
    } catch (error) {
        console.error('Error fetching endorsement count:', error);
        return NextResponse.json(
            { total: 0, bySkill: {} },
            { status: 200 }
        );
    }
}
