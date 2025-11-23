import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Provider from "./components/providers/WagmiProvider";
import MiniAppProvider from "./components/providers/MiniAppProvider";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Based Endorsements",
        description: "Endorse builders on Base with on-chain attestations",
        openGraph: {
            title: "Based Endorsements",
            description: "Endorse builders on Base with on-chain attestations",
        },
    };
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
            >
                <Provider>
                    <MiniAppProvider>
                        {children}
                    </MiniAppProvider>
                </Provider>
            </body>
        </html>
    );
}
