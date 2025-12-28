"use client";

import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  JOURNAL_REGISTRY_ABI,
  JOURNAL_REGISTRY_ADDRESS,
} from "@/lib/contracts";
import { uploadToIPFS } from "@/lib/ipfs";
import { IPFSMetadata } from "@/types";

export function useJournalEntry() {
  const { address } = useAccount();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<
    "idle" | "uploading" | "signing" | "confirming" | "success"
  >("idle");

  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  async function saveJournalEntry(metadata: IPFSMetadata) {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    setUploadError(null);
    reset();

    try {
      // Step 1: Upload to IPFS
      setCurrentStep("uploading");
      setIsUploading(true);
      console.log("📤 Uploading journal entry to IPFS...");

      const cid = await uploadToIPFS(metadata);
      console.log("✅ IPFS upload complete:", cid);

      setIsUploading(false);
      setCurrentStep("signing");

      // Step 2: Prepare transaction hash as bytes32
      const txHashBytes = metadata.txHash as `0x${string}`;

      // Step 3: Call smart contract
      console.log("📝 Writing to blockchain...");
      writeContract({
        address: JOURNAL_REGISTRY_ADDRESS,
        abi: JOURNAL_REGISTRY_ABI,
        functionName: "logEntry",
        args: [txHashBytes, cid],
      });

      setCurrentStep("confirming");
      return cid;
    } catch (error: any) {
      console.error("❌ Error saving journal entry:", error);
      setUploadError(error.message || "Failed to save journal entry");
      setIsUploading(false);
      setCurrentStep("idle");
      throw error;
    }
  }

  // Update step based on transaction status
  if (isSuccess && currentStep !== "success") {
    setCurrentStep("success");
    console.log("✅ Journal entry saved successfully!");
  }

  return {
    saveJournalEntry,
    isUploading,
    isPending,
    isConfirming,
    isSuccess,
    currentStep,
    error: uploadError || writeError?.message,
    hash,
    reset: () => {
      setUploadError(null);
      setCurrentStep("idle");
      reset();
    },
  };
}
