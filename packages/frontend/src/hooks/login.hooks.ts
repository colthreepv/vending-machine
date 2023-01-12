import { useState } from "react";
import { JwtContents, LoginPayload } from "shared-types/src/user";

import Cookies from "js-cookie";
import { decode } from "jsonwebtoken";

const useLogin = () => {
  const [token, setToken] = useState<string | null>(
    Cookies.get("token") ?? null
  );
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await response.json()) as LoginPayload;

      if (!response.ok) {
        throw new Error(`Login failed with response code ${response.status}`);
      }

      setToken(data.access_token);
      Cookies.set("token", data.access_token);
    } catch (err) {
      if (err instanceof Error && err.message != null) {
        setError(err.message);
      }
    }
  };

  const isLoggedIn = token != null;
  const userData: null | JwtContents =
    token != null ? (decode(token) as JwtContents) : null;

  return { token, login, error, isLoggedIn, userData };
};

export default useLogin;
