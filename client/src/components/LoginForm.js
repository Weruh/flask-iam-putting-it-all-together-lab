import { useState } from "react";
import { api } from "../api";
import Icon from "./Icon";

export default function LoginForm({ onLogin, signup = false }) {
  const [values, setValues] = useState({
    username: "",
    password: "",
    password_confirmation: "",
    image_url: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const update = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });
  async function submit(credentials = values, demo = false) {
    setError("");
    if (
      signup &&
      !demo &&
      credentials.password !== credentials.password_confirmation
    ) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      onLogin(
        await api(signup && !demo ? "/signup" : "/login", {
          method: "POST",
          body: JSON.stringify(credentials),
        }),
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            required
            value={values.username}
            onChange={update}
            placeholder="Your kitchen name"
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete={signup ? "new-password" : "current-password"}
            value={values.password}
            onChange={update}
            placeholder="Your secret ingredient"
          />
        </div>
        {signup && (
          <>
            <div className="field">
              <label htmlFor="password_confirmation">Confirm password</label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                autoComplete="new-password"
                required
                value={values.password_confirmation}
                onChange={update}
              />
            </div>
            <details className="profile-details">
              <summary>A little about you (optional)</summary>
              <div className="field">
                <label htmlFor="bio">Your kitchen story</label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="2"
                  value={values.bio}
                  onChange={update}
                />
              </div>
              <div className="field">
                <label htmlFor="image_url">Profile image URL</label>
                <input
                  id="image_url"
                  name="image_url"
                  type="url"
                  value={values.image_url}
                  onChange={update}
                  placeholder="https://…"
                />
              </div>
            </details>
          </>
        )}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button className="button primary w-full" disabled={busy}>
          {busy
            ? "Opening the kitchen…"
            : signup
              ? "Join the kitchen"
              : "Let’s get cooking"}
          <Icon />
        </button>
      </form>
      {!signup && (
        <>
          <div className="demo-divider">
            <span>JUST HAVING A LOOK?</span>
          </div>
          <button
            className="button secondary w-full"
            disabled={busy}
            onClick={() =>
              submit({ username: "demo", password: "reciplease-demo" }, true)
            }
          >
            <Icon name="book" /> Explore the demo kitchen
          </button>
        </>
      )}
    </>
  );
}
