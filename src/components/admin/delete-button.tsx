"use client";

import { m } from "motion/react";
import { deletePostAction } from "@/app/admin/artikel/actions";

// Hapus artikel lewat server action + window.confirm.
export default function DeleteButton({ id }: { id: number }) {
  return (
    <form
      action={deletePostAction}
      onSubmit={(e) => {
        if (
          !confirm(
            `Hapus artikel #${id}? Tindakan ini tidak bisa dibatalkan.`,
          )
        )
          e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <m.button
        whileTap={{ scale: 0.85 }}
        type="submit"
        className="cursor-pointer text-red-600 opacity-60 duration-150 hover:text-red-600 hover:opacity-100"
        aria-label="Hapus artikel"
      >
        🗑️
      </m.button>
    </form>
  );
}