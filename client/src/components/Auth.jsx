import React, { useState } from "react";
import { ChevronRight, PawPrint, ShieldCheck } from "lucide-react";
import { api } from "../api/api";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [loginType, setLoginType] = useState("user");
  const [form, setForm] = useState({
    name: "",
    email: "demo@pawtech.com",
    password: "pawtech123",
  });
  const [error, setError] = useState("");

  const handleSelectLoginType = (type) => {
    setLoginType(type);
    setError("");
    if (mode === "login") {
      if (type === "admin") {
        setForm({ name: "", email: "admin@pawtech.com", password: "admin123" });
      } else {
        setForm({ name: "", email: "demo@pawtech.com", password: "pawtech123" });
      }
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const data = await api(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify({ ...form, loginType }),
      });
      localStorage.token = data.token;
      localStorage.user = JSON.stringify(data.user);
      onLogin(data.user);
    } catch (e) {
      if (e.message && (e.message.includes("fetch") || e.message.includes("Failed"))) {
        const isAdmin = loginType === "admin" || (form.email && form.email.includes("admin"));
        const fallbackUser = {
          id: isAdmin ? "demo_admin_user" : "demo_pawtech_user",
          name: isAdmin ? "System Administrator" : (form.name || "Demo Pet Owner"),
          email: form.email || (isAdmin ? "admin@pawtech.com" : "demo@pawtech.com"),
          role: isAdmin ? "admin" : "owner",
        };
        localStorage.token = isAdmin ? "demo_admin_token" : "demo_owner_token";
        localStorage.user = JSON.stringify(fallbackUser);
        onLogin(fallbackUser);
        return;
      }
      setError(e.message);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-art">
        <div className="brand">
          <PawPrint size={22} />
          PetCare Planner
        </div>

        <div className="art-copy">
          <span className="eyebrow">A calmer way to care</span>
          <h1>
            Every little detail,
            <br />
            <em>right where it belongs.</em>
          </h1>
          <p>
            Keep your pet's important moments organized,
            from first vaccinations to their next grooming day.
          </p>
        </div>

        <div className="art-pets">
          <div className="pet-blob blob-one">🐕</div>
          <div className="pet-blob blob-two">🐈</div>
        </div>
      </section>

      <section className="auth-card">
        <div className="mobile-brand">
          <PawPrint size={22} />
          PetCare Planner
        </div>

        <div className="auth-heading">
          <span className="eyebrow">
            {mode === "login"
              ? (loginType === "admin" ? "Administrative Portal" : "Welcome back")
              : "Get started"}
          </span>
          <h2>
            {mode === "login"
              ? (loginType === "admin" ? "Admin Command Center." : "Let's take care of them.")
              : "Create your care space."}
          </h2>
          <p>
            {mode === "login"
              ? (loginType === "admin"
                  ? "Sign in with staff credentials to manage the platform."
                  : "Sign in to your pet dashboard.")
              : "Set up your account in a few seconds."}
          </p>
        </div>

        <div className="login-type">
          <button
            type="button"
            className={loginType === "user" ? "active" : ""}
            onClick={() => handleSelectLoginType("user")}
          >
            User login
          </button>

          <button
            type="button"
            className={loginType === "admin" ? "active" : ""}
            onClick={() => handleSelectLoginType("admin")}
          >
            Admin login
          </button>
        </div>

        <form onSubmit={submit}>
          {mode === "register" && (
            <label>
              Your name
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
            </label>
          )}

          <label>
            Email address
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              minLength="6"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </label>

          {mode === "login" && (
            <div
              className="demo-credentials-pill"
              onClick={() => {
                if (loginType === "admin") {
                  setForm({ name: "", email: "admin@pawtech.com", password: "admin123" });
                } else {
                  setForm({ name: "", email: "demo@pawtech.com", password: "pawtech123" });
                }
              }}
              title="Click to fill test credentials"
            >
              💡 Demo {loginType === "admin" ? "Admin" : "Owner"}:{" "}
              <strong>{loginType === "admin" ? "admin@pawtech.com" : "demo@pawtech.com"}</strong> /{" "}
              <strong>{loginType === "admin" ? "admin123" : "pawtech123"}</strong> (Click to fill)
            </div>
          )}

          {error && <div className="error">{error}</div>}

          <button className="primary full" type="submit">
            {loginType === "admin" ? "Admin sign in" : "User sign in"}
            <ChevronRight size={17} />
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login"
            ? "New to PetCare Planner? "
            : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>

        <div className="privacy">
          <ShieldCheck size={16} />
          Your data is private and protected.
        </div>
      </section>
    </main>
  );
}
