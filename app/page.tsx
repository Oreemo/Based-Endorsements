export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">⭐ Based Endorsements</h1>
                <p className="text-xl text-gray-400 mb-8">
                    Endorse builders on Base with on-chain attestations
                </p>
                <div className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block">
                    Frame is available at{" "}
                    <code className="font-mono bg-blue-700 px-2 py-1 rounded">
                        /api
                    </code>
                </div>
                <div className="mt-8 text-gray-500">
                    <p>To test this Frame:</p>
                    <ol className="list-decimal list-inside mt-2 space-y-2">
                        <li>Deploy to Vercel or similar hosting</li>
                        <li>
                            Test at{" "}
                            <a
                                href="https://warpcast.com/~/developers/frames"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline"
                            >
                                Farcaster Frame Validator
                            </a>
                        </li>
                        <li>Share in a Warpcast post!</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
