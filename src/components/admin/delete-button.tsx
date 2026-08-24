import { m } from "motion/react";
import { deletePost } from "@/app/admin/artikel/actions";
import type { PostActionState } from "@/app/admin/artikel/actions";

// Wrapper server action: parse FormData -> id, lalu panggil deletePost.
async function deletePostAction(_prev: PostActionState, fd: FormData): Promise<PostActionState> {
  const id = Number(fd.get("id"));
  if (Number.isNaN(id)) return { error: "id tidak valid" };
  await deletePost(id);
  return {};
}

// Hapus artikel lewat server action + window.confirm.
export default function DeleteButton({ id }: { id: number }) {
  return (
    <form
      action={deletePostAction}
      onSubmit={(e) => {
        if (!confirm(`Hapus artikel #${id}? Tindakan ini tidak bisa dibatalkan.`))
          e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <m.button
        whileTap={{ scale: 0.85 }}
        type="submit"
        className="cursor-pointer text-red-600/40 opacity-0 transition-colors hover:text-red-600 group-hover:static group-hover:opacity-100"
        aria-label="Hapus artikel"
      >
        🗑️
      </m.button>
    </form>
  );
}