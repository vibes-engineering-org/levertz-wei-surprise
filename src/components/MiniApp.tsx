"use client";

import { useState } from "react";
import { useAccount, useConnect, useWalletClient, injected } from "wagmi";

function SurpriseSomeone() {
  const { isConnected } = useAccount();
  const { connect } = useConnect({ connector: injected() });
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);

  const handleSurprise = async () => {
    if (!walletClient) return;
    setLoading(true);
    let recipient: string | null = null;
    while (!recipient) {
      const fid = Math.floor(Math.random() * 100000) + 1;
      try {
        const response = await fetch(
          `https://api.warpcast.com/fc/primary-address?fid=${fid}&protocol=ethereum`
        );
        const data = await response.json();
        if (data.address) {
          recipient = data.address;
          break;
        }
      } catch {
        // retry on error
      }
    }
    try {
      const hash = await walletClient.sendTransaction({
        to: recipient!,
        value: 10n ** 18n,
        chainId: 10143,
      });
      console.log("Surprised:", hash);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button
          onClick={() => connect()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={handleSurprise}
        disabled={loading}
        className="px-6 py-3 bg-green-500 text-white rounded"
      >
        {loading ? "Surprising..." : "Surprise Someone"}
      </button>
    </div>
  );
}

export default function MiniApp() {
  return <SurpriseSomeone />;
}
