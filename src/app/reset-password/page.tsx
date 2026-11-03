"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "../../components/ui/Button";
import { InputPassword } from "../../components/ui/InputPassword";
import { resetPassword } from "../../services/auth";

import styles from "./reset-password.module.css";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search,
    );

    setToken(params.get("token") ?? "");
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!token) {
      setError(
        "This password reset link is invalid.",
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(
        token,
        password,
      );

      setMessage(response.message);

      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "It was not possible to reset your password.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.brand}>
          <img
            src="/images/uhome-logo.svg"
            alt="UHome"
            className={styles.logo}
          />

          <p className={styles.tagline}>
            Find your place, fit your lifestyle
          </p>
        </div>

        <div className={styles.divider} />

        <div className={styles.heading}>
          <h1>Create a new password</h1>

          <p>
            Choose a new password for your UHome account.
          </p>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <InputPassword
            name="password"
            placeholder="New password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            autoComplete="new-password"
            required
          />

          <InputPassword
            name="confirmPassword"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            autoComplete="new-password"
            required
          />

          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}

          {message ? (
            <p
              className={styles.success}
              role="status"
            >
              {message}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            fullWidth
          >
            Reset password
          </Button>
        </form>

        <div className={styles.divider} />

        <Link
          href="/login"
          className={styles.back}
        >
          ← Back to Log in
        </Link>
      </section>
    </main>
  );
}