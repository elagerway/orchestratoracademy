"use client";

import { useState } from "react";

interface UpgradeButtonProps {
  plan: "pro" | "team";
}

export function UpgradeButton({ plan }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned:", data.error);
        setLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? "Redirecting..." : `Upgrade to ${plan.charAt(0).toUpperCase() + plan.slice(1)}`}
    </button>
  );
}
