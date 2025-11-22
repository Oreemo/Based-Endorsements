"use client";

import { useState } from "react";
import { resolveBasename } from "@/lib/basename";
import { buildAttestationRequest, EAS_ABI, EAS_CONTRACT_ADDRESS } from "@/lib/eas";
import { SKILL_OPTIONS, type SkillType } from "@/lib/constants";
import sdk from "@farcaster/frame-sdk";
import { base } from "viem/chains";
import { encodeFunctionData } from "viem";

type Step = "input" | "select-skill" | "confirm" | "transaction" | "success";

export default function EndorsementFlow() {
    const [step, setStep] = useState<Step>("input");
    const [basename, setBasename] = useState("");
    const [address, setAddress] = useState<string>("");
    const [skill, setSkill] = useState<SkillType | "">("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState<string>("");

    const handleBasenameSubmit = async () => {
        if (!basename.trim()) {
            setError("Please enter a basename");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const resolvedAddress = await resolveBasename(basename);
            if (!resolvedAddress) {
                // Try to get more info if possible, but for now just show generic error
                // The resolveBasename function logs to console, but we want to show user something if possible
                // Let's update resolveBasename to return error details? 
                // For now, just keep it simple but maybe the user entered an invalid name
                setError(`Could not resolve: ${basename}. Check spelling or try another.`);
                setLoading(false);
                return;
            }

            setAddress(resolvedAddress);
            setStep("select-skill");
        } catch (err) {
            setError("Error resolving basename");
        } finally {
            setLoading(false);
        }
    };

    const handleSkillSelect = (selectedSkill: SkillType) => {
        setSkill(selectedSkill);
        setStep("confirm");
    };

    const handleConfirm = async () => {
        console.log('[DEBUG] handleConfirm called', { address, skill });
        if (!address || !skill) {
            console.log('[DEBUG] Missing address or skill');
            return;
        }


        console.log('[DEBUG] Transaction hash:', hash);
        setTxHash(hash);
        setStep("success");
    } catch (err: any) {
        console.error('[DEBUG] Transaction error:', err);
        console.error('[DEBUG] Error details:', {
            message: err.message,
            code: err.code
        });
        setError(`Transaction failed: ${err.message || err.toString()}`);
    } finally {
        setLoading(false);
    }
};

return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
            {/* Input Step */}
            {step === "input" && (
                <div className="text-center space-y-6">
                    <div className="text-6xl mb-4">⭐</div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Based Endorsements
                    </h1>
                    <p className="text-white/90 text-lg mb-8">
                        Endorse a builder & boost their reputation on-chain
                    </p>
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={basename}
                            onChange={(e) => {
                                setBasename(e.target.value);
                                setError("");
                            }}
                            placeholder="e.g., jesse or jesse.base.eth"
                            className="w-full px-4 py-3 rounded-lg text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                        {error && (
                            <p className="text-red-200 text-sm">{error}</p>
                        )}
                        <button
                            onClick={handleBasenameSubmit}
                            disabled={loading}
                            className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold text-lg hover:bg-white/90 transition disabled:opacity-50"
                        >
                            {loading ? "Resolving..." : "Next →"}
                        </button>
                    </div>
                </div>
            )}

            {/* Skill Selection Step */}
            {step === "select-skill" && (
                <div className="text-center space-y-6">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Endorsing: {basename}
                    </h2>
                    <p className="text-white/90 text-lg mb-8">
                        Select their superpower:
                    </p>
                    <div className="space-y-3">
                        {SKILL_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSkillSelect(option.value)}
                                className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-lg font-semibold text-xl transition border-2 border-white/20 hover:border-white/40"
                            >
                                {option.label}
                            </button>
                        ))}
                        <button
                            onClick={() => setStep("input")}
                            className="w-full bg-white/5 text-white/70 py-3 rounded-lg font-semibold text-lg hover:bg-white/10 transition"
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Step */}
            {step === "confirm" && (
                <div className="text-center space-y-6">
                    <div className="text-5xl mb-4">✅</div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Ready to Endorse!
                    </h2>
                    <div className="bg-white/10 rounded-lg p-6 space-y-3 text-left">
                        <div>
                            <p className="text-white/70 text-sm">Basename</p>
                            <p className="text-white font-semibold text-lg">{basename}</p>
                        </div>
                        <div>
                            <p className="text-white/70 text-sm">Address</p>
                            <p className="text-white font-mono text-sm break-all">{address}</p>
                        </div>
                        <div>
                            <p className="text-white/70 text-sm">Skill</p>
                            <p className="text-white font-semibold text-lg">
                                {SKILL_OPTIONS.find(s => s.value === skill)?.label}
                            </p>
                        </div>
                    </div>
                    <p className="text-white/80 text-sm">On-chain Attestation via EAS</p>
                    {error && (
                        <p className="text-red-200 text-sm">{error}</p>
                    )}
                    <div className="space-y-3">
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-bold text-xl transition disabled:opacity-50"
                        >
                            {loading ? "Signing..." : "Endorse Builder"}
                        </button>
                        <button
                            onClick={() => setStep("select-skill")}
                            disabled={loading}
                            className="w-full bg-white/5 text-white/70 py-3 rounded-lg font-semibold text-lg hover:bg-white/10 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Success Step */}
            {step === "success" && (
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
            )}
        </div>
    </div>
);
}
