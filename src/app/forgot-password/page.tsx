"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import { Button } from "../../components/ui/Button";
import { InputText } from "../../components/ui/InputText";
import { forgotPassword } from "../../services/auth";

import styles from "./forgot-password.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await forgotPassword(email);

      setMessage(response.message);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "It was not possible to send the recovery email.",
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
          <h1>Forgot your password?</h1>

          <p>
            Enter the email associated with your UHome account
            and we&apos;ll send you a reset link.
          </p>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <InputText
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            autoComplete="email"
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
            Send reset link
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