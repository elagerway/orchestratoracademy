"use client";

import { useState } from "react";

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No portal URL returned:", data.error);
        setLoading(false);
      }
    } catch (error) {
      console.error("Portal error:", error);
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? "Redirecting..." : "Manage Subscription"}
    </button>
  );
}
