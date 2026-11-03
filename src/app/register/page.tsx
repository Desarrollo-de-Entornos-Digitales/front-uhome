"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { InputText } from "../../components/ui/InputText";
import { InputPassword } from "../../components/ui/InputPassword";
import { Button } from "../../components/ui/Button";
import { register } from "../../services/auth";

import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email || !password || !fullName || !username) {
      setError("Please complete all fields.");
      return;
    }

    setLoading(true);

    try {
      await register({
        email,
        password,
        fullName,
        username,
      });

      router.push("/login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "It was not possible to create your account.",
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

        <form className={styles.form} onSubmit={handleSubmit}>
          <InputText
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <InputPassword
            name="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />

          <InputText
            name="fullName"
            placeholder="Full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            autoComplete="name"
            required
          />

          <InputText
            name="username"
            placeholder="User name"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />

          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            fullWidth
          >
            Sign up
          </Button>
        </form>

        <div className={styles.divider} />

        <p className={styles.login}>
          Already have an account?{" "}
          <Link href="/login">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}