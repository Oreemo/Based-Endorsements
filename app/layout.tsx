import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Based Endorsements",
    description: "Endorse builders on Base with on-chain attestations",
};

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
