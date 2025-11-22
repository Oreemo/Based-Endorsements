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

}
