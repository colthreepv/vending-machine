import { useState } from "react";
import { LoginPayload } from "shared-types/src/user";

const useLogin = () => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function login(username: string, password: string) {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await response.json()) as LoginPayload;

      if (!response.ok) {
        throw new Error(`Login failed with response code ${response.status}`);
      }

      setToken(data.access_token);
    } catch (err) {
      if (err instanceof Error && err.message != null) {
        setError(err.message);
      }
    }
  }

  const isLoggedIn = token != null;

  return { token, login, error, isLoggedIn };
};

export default useLogin;
