// components/Comments.tsx — Self-hosted SEO-crawlable comments
//
// This is a SERVER COMPONENT. Approved comments are rendered in HTML at
// build/ISR time so Google can crawl and index them — genuine SEO value.
//
// New comments submitted via <CommentForm> start as approved=false.
// Approve them in Admin → 📥 Leads → 💬 Blog Comments section.
// They appear publicly on the next ISR cycle (daily revalidation).

import CommentForm from "@/components/CommentForm";
import { isSupabaseEnabled, dbGetCommentsBySlug } from "@/lib/db";
import { localGetCommentsBySlug } from "@/lib/localDb";
import type { DbComment } from "@/lib/db";

interface CommentsProps {
  slug: string;
}

async function getApprovedComments(slug: string): Promise<Omit<DbComment, "author_email">[]> {
  try {
    const raw = isSupabaseEnabled()
      ? await dbGetCommentsBySlug(slug)
      : localGetCommentsBySlug(slug);
    // Never expose author_email publicly
    return raw.map(({ author_email: _e, ...rest }) => rest);
  } catch {
    return [];
  }
}

export default async function Comments({ slug }: CommentsProps) {
  const comments = await getApprovedComments(slug);

  return (
    <section className="mt-12" aria-label="Comments">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Comments
        {comments.length > 0 && (
          <span className="text-lg font-normal text-gray-400 ml-2">({comments.length})</span>
        )}
      </h2>

      {comments.length === 0 ? (
        <p className="text-gray-400 text-sm mb-8">
          No comments yet — be the first to share your thoughts.
        </p>
      ) : (
        <div className="space-y-5 mb-10">
          {comments.map((c) => (
            <div key={c.id ?? `${c.author_name}-${c.submitted_at}`}
              className="bg-gray-50 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-sm select-none">
                  {c.author_name[0]?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{c.author_name}</div>
                  {c.submitted_at && (
                    <time
                      className="text-xs text-gray-400"
                      dateTime={c.submitted_at}
                    >
                      {new Date(c.submitted_at).toLocaleDateString("en-US", {
                        year:  "numeric",
                        month: "long",
                        day:   "numeric",
                      })}
                    </time>
                  )}
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-gray-100 pt-8">
        <CommentForm slug={slug} />
      </div>
    </section>
  );
}
