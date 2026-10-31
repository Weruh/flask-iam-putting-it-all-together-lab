import { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Login from "../pages/Login";
import RecipeList from "../pages/RecipeList";
import NewRecipe from "../pages/NewRecipe";
import { api } from "../api";

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [connectionError, setConnectionError] = useState("");
  function checkSession() {
    setChecking(true);
    setConnectionError("");
    api("/check_session")
      .then(setUser)
      .catch((error) => {
        if (error.status !== 401) setConnectionError(error.message);
      })
      .finally(() => setChecking(false));
  }
  useEffect(() => {
    checkSession();
  }, []);
  if (checking)
    return (
      <main className="loading-screen" aria-live="polite">
        <span className="brand">
          reciplease<span>.</span>
        </span>
        <p>Setting the table…</p>
      </main>
    );
  if (!user)
    return (
      <>
        <Login onLogin={setUser} />
        {connectionError && (
          <div className="connection-note" role="alert">
            {connectionError}{" "}
            <button onClick={checkSession}>Retry connection</button>
          </div>
        )}
      </>
    );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <NavBar user={user} setUser={setUser} />
      <main id="main">
        <Switch>
          <Route exact path="/new">
            <NewRecipe user={user} onSessionExpired={() => setUser(null)} />
          </Route>
          <Route path="/">
            <RecipeList user={user} onSessionExpired={() => setUser(null)} />
          </Route>
        </Switch>
      </main>
      <footer className="site-footer shell">
        <span className="brand">
          reciplease<span>.</span>
        </span>
        <p>Good food is even better shared.</p>
        <span className="eyebrow">A little inspiration. A lot of love.</span>
      </footer>
    </>
  );
}
