import { useState } from "react";
import LoginForm from "../components/LoginForm";
import Icon from "../components/Icon";

export default function Login({ onLogin }) {
  const [showLogin, setShowLogin] = useState(true);
  return (
    <main className="auth-page">
      <section className="auth-story">
        <a className="brand" href="/">
          reciplease<span>.</span>
        </a>
        <div className="auth-intro">
          <p className="eyebrow">
            <span className="small-rule" /> THE HOME COOK’S COLLECTIVE
          </p>
          <h1>
            A little inspiration.
            <br />
            Something <em>delicious.</em>
          </h1>
          <p>
            Recipes worth keeping. Meals worth sharing.
            <br />
            Pull up a chair — you’re in good company.
          </p>
        </div>
        <div className="auth-photo">
          <img
            src="/assets/tomato-pasta.jpg"
            alt="Freshly cooked pasta in a rich tomato and basil sauce"
            onError={(e) => {
              e.currentTarget.style.visibility = "hidden";
            }}
          />
          <div className="photo-caption">
            <span>FROM ONE KITCHEN TO ANOTHER</span>
            <Icon size={28} />
          </div>
          <span className="photo-stamp">
            <Icon name="leaf" size={28} />
            <span>
              Made with
              <br />a little love.
            </span>
          </span>
        </div>
        <p className="story-foot">
          Every great recipe starts with someone sharing it.
        </p>
      </section>
      <section
        className="auth-panel"
        aria-label={showLogin ? "Log in" : "Create an account"}
      >
        <div className="auth-top">
          <Icon name="book" />
          <span>YOUR NEXT FAVORITE STARTS HERE</span>
        </div>
        <div className="auth-form-wrap">
          <p className="eyebrow text-tomato">
            {showLogin
              ? "WELCOME BACK TO THE TABLE"
              : "THERE’S ALWAYS ROOM FOR ONE MORE"}
          </p>
          <h2>{showLogin ? "Hello, home cook." : "Make yourself at home."}</h2>
          <p className="muted">
            {showLogin
              ? "Log in to find a little kitchen inspiration."
              : "Create an account and share something delicious."}
          </p>
          <div className="auth-tabs" role="group" aria-label="Account options">
            <button
              className={showLogin ? "selected" : ""}
              aria-pressed={showLogin}
              onClick={() => setShowLogin(true)}
            >
              Log in
            </button>
            <button
              className={!showLogin ? "selected" : ""}
              aria-pressed={!showLogin}
              onClick={() => setShowLogin(false)}
            >
              Sign up
            </button>
          </div>
          <LoginForm
            key={showLogin ? "login" : "signup"}
            signup={!showLogin}
            onLogin={onLogin}
          />
          <p className="auth-switch">
            {showLogin ? "New to our kitchen?" : "Already part of the kitchen?"}{" "}
            <button
              className="text-button"
              onClick={() => setShowLogin(!showLogin)}
            >
              {showLogin ? "Come on in" : "Log in"} <Icon size={15} />
            </button>
          </p>
        </div>
        <div className="auth-bottom">
          <Icon name="leaf" size={18} />
          <p>A space for real recipes, from real home cooks.</p>
        </div>
      </section>
    </main>
  );
}
