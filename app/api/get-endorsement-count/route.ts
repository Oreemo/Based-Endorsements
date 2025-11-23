import { NextRequest, NextResponse } from 'next/server';
import { ENDORSEMENT_SCHEMA_UID } from '@/lib/constants';

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
        // GraphQL query to count attestations for this recipient with our schema
        const query = `
            query CountEndorsements($recipient: String!, $schemaId: String!) {
                attestations(
                    where: {
                        schemaId: { equals: $schemaId }
                        recipient: { equals: $recipient }
                        revoked: { equals: false }
                    }
                ) {
                    id
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
                { count: 0 },
                { status: 200 }
            );
        }

        const data = await response.json();

        if (data.errors) {
            console.error('GraphQL errors:', data.errors);
            return NextResponse.json(
                { count: 0 },
                { status: 200 }
            );
        }

        const count = data.data?.attestations?.length || 0;

        return NextResponse.json({ count });
    } catch (error) {
        console.error('Error fetching endorsement count:', error);
        return NextResponse.json(
            { count: 0 },
            { status: 200 }
        );
    }
}
