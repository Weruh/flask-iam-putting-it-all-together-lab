import { useState } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { api } from "../api";
import Icon from "./Icon";

export default function NavBar({ user, setUser }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();
  async function logout() {
    setBusy(true);
    try {
      await api("/logout", { method: "DELETE" });
      history.push("/");
      setUser(null);
    } catch (e) {
      if (e.status === 401) setUser(null);
      else setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <header className="site-header shell">
      <Link className="brand" to="/" aria-label="Reciplease home">
        reciplease<span>.</span>
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        <NavLink exact to="/" activeClassName="active">
          The recipe collection
        </NavLink>
        <NavLink to="/new" activeClassName="active">
          Share a recipe
        </NavLink>
      </nav>
      <div className="account">
        <span className="avatar" aria-hidden="true">
          {user.username.slice(0, 1).toUpperCase()}
        </span>
        <span className="account-name">{user.username}</span>
        <button
          className="icon-button"
          onClick={logout}
          disabled={busy}
          aria-label={busy ? "Logging out" : "Log out"}
          title="Log out"
        >
          <Icon name="logout" />
        </button>
      </div>
      {error && (
        <p className="error header-error" role="alert">
          {error}
        </p>
      )}
    </header>
  );
}
