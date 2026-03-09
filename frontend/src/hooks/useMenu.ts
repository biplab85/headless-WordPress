"use client";

import { useEffect, useState } from "react";
import type { WPMenu } from "@/types/menu";

export function useMenu(location: string) {
  const [menu, setMenu] = useState<WPMenu | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    if (!apiUrl) {
      setLoading(false);
      return;
    }

    fetch(`${apiUrl}/wp-json/wp-api-menus/v2/menu-locations/${location}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setMenu(data))
      .catch(() => setMenu(null))
      .finally(() => setLoading(false));
  }, [location]);

  return { menu, loading };
}
