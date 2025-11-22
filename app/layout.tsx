import type { Metadata } from "next";
import "./globals.css";

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
