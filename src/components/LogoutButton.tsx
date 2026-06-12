"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await createClient().auth.signOut();
        router.push("/");
        router.refresh();
      }}
      className="rounded-lg border-2 border-ink bg-white px-2 py-1 text-xs font-bold shadow-popSm hover:bg-coral hover:text-white"
    >
      Выйти
    </button>
  );
}
