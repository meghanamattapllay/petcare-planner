import React, { useState } from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [user, setUser] = useState(() => (localStorage.user ? JSON.parse(localStorage.user) : null));

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <Dashboard
      user={user}
      onLogout={() => {
        localStorage.clear();
        setUser(null);
      }}
    />
  );
}
