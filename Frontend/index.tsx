import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import {GoogleOAuthProvider} from "@react-oauth/google"

if (typeof window !== "undefined") {
  const root = createRoot(document.getElementById("root") as HTMLElement);
  
  const GOOGLE_CLIENT_ID = process.env.BUN_PUBLIC_GOOGLE_CLIENT_ID
  if (!GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID IS MISSING!!!");
  }
  
 root.render(
    <StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </StrictMode>
  );
}
