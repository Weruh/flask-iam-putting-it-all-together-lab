import { useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { api } from "../api";
import Icon from "../components/Icon";

export default function RecipeList({ user, onSessionExpired }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All recipes");
  const match = useRouteMatch("/recipe/:id");
  function load() {
    setLoading(true);
    setError("");
    api("/recipes")
      .then(setRecipes)
      .catch((e) => {
        if (e.status === 401) onSessionExpired();
        else setError(e.message);
      })
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    load(); /* Session handlers follow the authenticated app. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const recipe = match && recipes.find((r) => String(r.id) === match.params.id);
  if (match)
    return (
      <section className="shell recipe-detail">
        <Link className="text-button" to="/">
          ← Back to the collection
        </Link>
        {loading ? (
          <p role="status">Opening the recipe…</p>
        ) : error ? (
          <div role="alert">
            <p className="error">{error}</p>
            <button className="button secondary" onClick={load}>
              Try again
            </button>
          </div>
        ) : recipe ? (
          <article>
            <p className="eyebrow text-tomato">FROM OUR COMMUNITY KITCHEN</p>
            <h1>{recipe.title}</h1>
            <div className="recipe-meta">
              <span>
                <Icon name="clock" />
                {recipe.minutes_to_complete} minutes
              </span>
              <span>Shared by {recipe.user.username}</span>
            </div>
            <div className="markdown">
              <ReactMarkdown>{recipe.instructions}</ReactMarkdown>
            </div>
            <div className="recipe-end">
              <Icon name="leaf" />
              <span>Made to be cooked, shared, and made your own.</span>
            </div>
          </article>
        ) : (
          <>
            <h1>This page is missing a recipe.</h1>
            <p>Find something delicious in the collection.</p>
          </>
        )}
      </section>
    );
  const filtered = recipes.filter(
    (r) =>
      (filter !== "My recipes" || r.user_id === user.id) &&
      (filter !== "30 minutes or less" || r.minutes_to_complete <= 30) &&
      `${r.title} ${r.instructions} ${r.user.username}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <section className="collection-hero shell">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="small-rule" /> GOOD FOOD. SHARED GENEROUSLY.
          </p>
          <h1>
            Your next
            <br />
            <em>“make it again.”</em>
          </h1>
          <p>
            A collection of kitchen favorites, passed from
            <br className="desktop-break" /> one home cook to another. Find
            yours.
          </p>
          <a href="#collection" className="text-button">
            Find something delicious <Icon />
          </a>
          <div className="hero-note">
            <Icon name="leaf" size={28} />
            <span>
              Everyday ingredients.
              <br />
              Extraordinary little moments.
            </span>
          </div>
        </div>
        <div className="hero-photo">
          <img
            src="/assets/tomato-pasta.jpg"
            alt="A pan of tomato pasta with fresh basil, ready to share"
            onError={(e) => {
              e.currentTarget.style.visibility = "hidden";
            }}
          />
          <div className="hero-photo-label">
            <span className="eyebrow">THE JOY OF HOME COOKING</span>
            <span>Simple. Seasonal. Yours.</span>
          </div>
          <span className="hero-seal">
            GOOD
            <br />
            <em>food</em>
            <br />
            GOOD MOOD
          </span>
        </div>
      </section>
      <section id="collection" className="collection shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow text-tomato">THE COMMUNITY COOKBOOK</p>
            <h2>A good place to start.</h2>
          </div>
          <Link className="button primary" to="/new">
            <Icon name="plus" /> Share a recipe
          </Link>
        </div>
        <div className="collection-tools">
          <div className="filters" role="group" aria-label="Filter recipes">
            {["All recipes", "30 minutes or less", "My recipes"].map((item) => (
              <button
                key={item}
                aria-pressed={filter === item}
                className={filter === item ? "selected" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="search-field">
            <Icon name="search" />
            <span className="sr-only">Search recipes</span>
            <input
              type="search"
              placeholder="Find your next favorite…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
        {loading ? (
          <div className="empty-state" role="status">
            Gathering the recipes…
          </div>
        ) : error ? (
          <div className="empty-state" role="alert">
            <p className="error">{error}</p>
            <button className="button secondary" onClick={load}>
              Try again
            </button>
          </div>
        ) : (
          <>
            <p className="result-count" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "recipe" : "recipes"}{" "}
              to make your own
            </p>
            {filtered.length ? (
              <div className="recipe-grid">
                {filtered.map((r, i) => (
                  <article className="recipe-card" key={r.id}>
                    <div className="card-top">
                      <span className="recipe-number">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="recipe-time">
                        <Icon name="clock" size={16} />
                        {r.minutes_to_complete} MIN
                      </span>
                    </div>
                    <h3>
                      <Link to={`/recipe/${r.id}`}>{r.title}</Link>
                    </h3>
                    <p>
                      {r.instructions
                        .split(/\n\s*\n/)[0]
                        .replace(/[#*_`]/g, "")
                        .slice(0, 145)}
                      {r.instructions.split(/\n\s*\n/)[0].length > 145
                        ? "…"
                        : ""}
                    </p>
                    <div className="card-bottom">
                      <span>
                        From <strong>{r.user.username}’s</strong> kitchen
                      </span>
                      <Link
                        className="round-link"
                        aria-label={`Read ${r.title}`}
                        to={`/recipe/${r.id}`}
                      >
                        <Icon />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Icon name="book" size={36} />
                <h3>
                  {recipes.length
                    ? "Nothing on this page. Yet."
                    : "The first recipe could be yours."}
                </h3>
                <p>
                  {recipes.length
                    ? "Try a different search or share a favorite from your kitchen."
                    : "Bring your favorite dish to the table and get the collection started."}
                </p>
                <Link className="button primary" to="/new">
                  Share a recipe <Icon name="plus" />
                </Link>
                {(query || filter !== "All recipes") && (
                  <button
                    className="text-button"
                    onClick={() => {
                      setQuery("");
                      setFilter("All recipes");
                    }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </section>
      <aside className="kitchen-note shell">
        <Icon name="book" size={38} />
        <div>
          <p className="eyebrow">FROM YOUR KITCHEN, WITH LOVE</p>
          <h2>Some recipes are too good to keep to yourself.</h2>
        </div>
        <Link to="/new" className="text-button">
          Pass one on <Icon />
        </Link>
      </aside>
    </>
  );
}
