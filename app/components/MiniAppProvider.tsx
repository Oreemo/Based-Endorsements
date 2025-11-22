"use client";

import { useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";

export default function MiniAppProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);

    useEffect(() => {
        const load = async () => {
            // Call ready() to signal the app is loaded
            await sdk.actions.ready();
            setIsSDKLoaded(true);
        };

        if (sdk && !isSDKLoaded) {
            load();
        }
    }, [isSDKLoaded]);

    // Optionally show a loading state until SDK is ready
    if (!isSDKLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return <>{children}</>;
}
