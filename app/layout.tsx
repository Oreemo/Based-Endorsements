import type { Metadata } from "next";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
    const frameMetadata = {
        title: "Based Endorsements",
        description: "Endorse builders on Base with on-chain attestations",
        openGraph: {
            title: "Based Endorsements",
            description: "Endorse builders on Base with on-chain attestations",
            images: [`https://oreemo.xyz/api/image`],
        },
        other: {
            // Farcaster Frame metadata
            'fc:frame': 'vNext',
            'fc:frame:image': `https://oreemo.xyz/api/image`,
            'fc:frame:image:aspect_ratio': '1:1',
            'fc:frame:post_url': `https://oreemo.xyz/api`,
            'fc:frame:button:1': 'Start Endorsing',
            'fc:frame:input:text': 'Enter Basename (e.g., jesse)',
        },
    };

    return frameMetadata;
}

import FarcasterProvider from "./components/FarcasterProvider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <FarcasterProvider>{children}</FarcasterProvider>
            </body>
        </html>
    );
}
