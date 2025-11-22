import type { Metadata } from "next";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
    const frameMetadata = {
        title: "Based Endorsements",
        description: "Endorse builders on Base with on-chain attestations",
        openGraph: {
            title: "Based Endorsements",
            description: "Endorse builders on Base with on-chain attestations",
            images: [`${process.env.NEXT_PUBLIC_URL || 'https://based-endorsements.vercel.app'}/api/image`],
        },
        other: {
            // Farcaster Frame metadata
            'fc:frame': 'vNext',
            'fc:frame:image': `${process.env.NEXT_PUBLIC_URL || 'https://based-endorsements.vercel.app'}/api/image`,
            'fc:frame:image:aspect_ratio': '1:1',
            'fc:frame:post_url': `${process.env.NEXT_PUBLIC_URL || 'https://based-endorsements.vercel.app'}/api`,
            'fc:frame:button:1': 'Start Endorsing',
            'fc:frame:input:text': 'Enter Basename (e.g., jesse)',
        },
    };

    return frameMetadata;
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
