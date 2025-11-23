import type { Metadata } from "next";
import "./globals.css";
import Provider from "./components/providers/WagmiProvider";
import MiniAppProvider from "./components/MiniAppProvider";

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
            <body>
                <Provider>
                    <MiniAppProvider>
                        {children}
                    </MiniAppProvider>
                </Provider>
            </body>
        </html>
    );
}
