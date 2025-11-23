                )}

{/* Success Step */ }
{
    step === "success" && (
        <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-white mb-2">
                Endorsed!
            </h2>
            <p className="text-white/90 text-xl">
                Your endorsement is now on-chain
            </p>
            <p className="text-white/70 text-lg">
                Building reputation, one endorsement at a time
            </p>
            <div className="space-y-3">
                <button
                    onClick={() => {
                        setStep("input");
                        setBasename("");
                        setAddress("");
                        setSkill("");
                        setError("");
                        setTxHash("");
                    }}
                    className="w-full bg-white text-blue-600 py-4 rounded-lg font-bold text-xl hover:bg-white/90 transition"
                >
                    Endorse Another Builder
                </button>
                {txHash && (
                    <a
                        href={`https://base.easscan.org/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-white/10 text-white py-3 rounded-lg font-semibold text-lg hover:bg-white/20 transition"
                    >
                        View on EASScan →
                    </a>
                )}
            </div>
        </div>
    )
}
            </div >
        </div >
    );
}
