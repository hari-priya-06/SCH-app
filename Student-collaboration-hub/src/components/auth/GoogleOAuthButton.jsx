import React from "react";

export default function GoogleOAuthButton() {
  const handleGoogleLogin = () => {
    alert("Google OAuth not implemented. Set up backend and Google API.");
  };
  return (
    <button onClick={handleGoogleLogin} style={{ background: "#4285F4", color: "white", padding: 10, border: "none", borderRadius: 4, width: "100%", marginTop: 8 }}>
      Sign in with Google
    </button>
  );
} 