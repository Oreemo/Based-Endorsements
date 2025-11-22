import type { Metadata } from "next";
import "./globals.css";
import FrameMetadata from "./components/FrameMetadata";

export async function generateMetadata(): Promise<Metadata> {
    const frameMetadata = {
        title: "Based Endorsements",
        description: "Endorse builders on Base with on-chain attestations",
        openGraph: {
            title: "Based Endorsements",
            description: "Endorse builders on Base with on-chain attestations",
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
            <head>
                <FrameMetadata />
            </head>
            <body>
                <FarcasterProvider>{children}</FarcasterProvider>
            </body>
        </html>
    );
}
