import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { api } from "../api";
import Icon from "../components/Icon";

export default function NewRecipe({ user, onSessionExpired }) {
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState("30");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const history = useHistory();
  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const recipe = await api("/recipes", {
        method: "POST",
        body: JSON.stringify({
          title,
          instructions,
          minutes_to_complete: minutes,
        }),
      });
      history.push(`/recipe/${recipe.id}`);
    } catch (e) {
      if (e.status === 401) onSessionExpired();
      else setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="shell editor-page">
      <Link className="text-button" to="/">
        ← Back to the collection
      </Link>
      <p className="eyebrow text-tomato">FROM YOUR KITCHEN, WITH LOVE</p>
      <h1>
        Pass on something <em>good.</em>
      </h1>
      <p className="muted">
        That family favorite. Your weeknight staple. The one everyone asks for.
      </p>
      <div className="editor-grid">
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="title">Recipe title</label>
            <input
              id="title"
              value={title}
              required
              maxLength={180}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are we cooking?"
            />
          </div>
          <div className="field time-field">
            <label htmlFor="minutes">Total time (minutes)</label>
            <input
              id="minutes"
              type="number"
              min="1"
              step="1"
              required
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="instructions">Ingredients & instructions</label>
            <p className="field-help" id="instructions-help">
              Include quantities and each step. Markdown is welcome — use ## for
              headings and - for a list. At least 50 characters.
            </p>
            <textarea
              id="instructions"
              aria-describedby="instructions-help"
              rows="13"
              required
              minLength={50}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={
                "## Ingredients\n- Your ingredients here\n\n## Method\n1. Start with a little love…"
              }
            />
            <span className="character-count">
              {instructions.length} characters
            </span>
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-6">
            <button className="button primary" disabled={busy}>
              {busy ? "Sharing your recipe…" : "Share with the kitchen"}
              <Icon />
            </button>
            <Link className="text-button" to="/">
              Cancel
            </Link>
          </div>
        </form>
        <aside className="recipe-preview">
          <div className="preview-label">
            <Icon name="book" />
            <span className="eyebrow">
              A TASTE OF YOUR RECIPE · LIVE PREVIEW
            </span>
          </div>
          <h2>{title || "Your next kitchen favorite"}</h2>
          <div className="recipe-meta">
            <span>
              <Icon name="clock" size={16} />
              {minutes || "—"} min
            </span>
            <span>By {user.username}</span>
          </div>
          <div className="markdown">
            {instructions ? (
              <ReactMarkdown>{instructions}</ReactMarkdown>
            ) : (
              <p className="preview-placeholder">
                Your ingredients and instructions will appear here as you write.
                Make it delicious.
              </p>
            )}
          </div>
          <Icon name="leaf" size={32} />
        </aside>
      </div>
    </section>
  );
}
