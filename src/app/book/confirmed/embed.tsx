"use client";

import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK || "robotfood/consult";

export function BookConfirmedEmbed() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    (async () => {
      const cal = await getCalApi({});
      cal("ui", {
        theme: "auto",
        cssVarsPerTheme: {
          light: { "cal-brand": "#22c55e" },
          dark: { "cal-brand": "#34d399" },
        },
        hideEventTypeDetails: false,
      });
    })();
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      {mounted ? (
        <Cal
          namespace="consult-paid"
          calLink={CAL_LINK}
          style={{ width: "100%" }}
          config={{
            layout: "month_view",
          }}
        />
      ) : (
        <div className="flex h-[480px] items-center justify-center text-sm text-muted-foreground">
          Loading scheduler…
        </div>
      )}
    </div>
  );
}
