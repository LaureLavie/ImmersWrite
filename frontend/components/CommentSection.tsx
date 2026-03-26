// frontend/components/CommentSection.tsx
"use client";
import { useState } from "react";
import { addComment, type CommentType } from "@/lib/api/engagement";
import { getAuthToken } from "@/lib/auth/cookies";
import "@/styles/comments.css";

interface CommentSectionProps {
  slug: string;
  order: number;
  initialComments: CommentType[];
}


function CommentCard({
  comment,
  slug,
  order,
  onReplyAdded,
}: {
  comment: CommentType;
  slug: string;
  order: number;
  onReplyAdded: (parentId: number, newReply: CommentType) => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Formate la date : "12 juin 2026"
  const formattedDate = new Date(comment.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;
    const token = getAuthToken();
    if (!token) {
      setError("Tu dois être connecté pour répondre.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const newReply = await addComment(slug, order, replyContent, token, comment.id);
      onReplyAdded(comment.id, newReply);
      setReplyContent("");
      setShowReplyForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'envoi.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`comment-card ${comment.is_author_reply ? "comment-card-author" : ""}`}>
      <div className="comment-header">
        <span className={`comment-user-label ${comment.is_author_reply ? "comment-author-badge" : ""}`}>
          {comment.user_label ?? "Lecteur"}
        </span>
        <span className="comment-date">{formattedDate}</span>
      </div>

      <p className="comment-content">{comment.content}</p>

      {/* Bouton "Répondre" — visible pour les users connectés */}
      {!comment.is_author_reply && getAuthToken() && (
        <button
          className="comment-reply-btn"
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          {showReplyForm ? "Annuler" : "↩ Répondre"}
        </button>
      )}

      {/* Formulaire de réponse */}
      {showReplyForm && (
        <div className="comment-reply-form">
          <textarea
            className="comment-textarea"
            placeholder="Ta réponse..."
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
            rows={3}
          />
          {error && <p className="comment-error">{error}</p>}
          <button
            className="btn-choice btn-sm"
            onClick={handleSendReply}
            disabled={sending || !replyContent.trim()}
          >
            {sending ? "Envoi..." : "Envoyer la réponse"}
          </button>
        </div>
      )}

      {/* Réponses imbriquées */}
      {comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map(reply => (
            <CommentCard
              key={reply.id}
              comment={reply}
              slug={slug}
              order={order}
              onReplyAdded={onReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}



export default function CommentSection({ slug, order, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const isLoggedIn = !!getAuthToken();

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const token = getAuthToken();
    if (!token) { setError("Tu dois être connecté pour commenter."); return; }

    setSending(true);
    setError("");
    try {
      const created = await addComment(slug, order, newComment, token);
    
      setComments(prev => [...prev, { ...created, replies: [] }]);
      setNewComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur d'envoi.");
    } finally {
      setSending(false);
    }
  };


  const handleReplyAdded = (parentId: number, newReply: CommentType) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === parentId
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      )
    );
  };

  return (
    <section className="comment-section">
      <h2 className="comment-section-title">
        {comments.length > 0
          ? `${comments.length} voix du Passeur`
          : "Sois le premier à laisser une trace"}
      </h2>

      {/* Liste des commentaires */}
      {comments.length > 0 && (
        <div className="comment-list">
          {comments.map(comment => (
            <CommentCard
              key={comment.id}
              comment={comment}
              slug={slug}
              order={order}
              onReplyAdded={handleReplyAdded}
            />
          ))}
        </div>
      )}

      {/* Formulaire de nouveau commentaire */}
      {isLoggedIn ? (
        <div className="comment-form">
          <textarea
            className="comment-textarea"
            placeholder="Laisse une trace de ton passage..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            rows={4}
            maxLength={1000}
          />
          <div className="comment-form-footer">
            <span className="comment-char-count">{newComment.length} / 1000</span>
            {error && <p className="comment-error">{error}</p>}
            <button
              className="btn-gold btn-sm"
              onClick={handleAddComment}
              disabled={sending || !newComment.trim()}
            >
              {sending ? "Envoi..." : "Partager ✦"}
            </button>
          </div>
        </div>
      ) : (
        <p className="comment-login-hint">
          <a href="/login" className="link">Connecte-toi</a> pour laisser une trace.
        </p>
      )}
    </section>
  );
}