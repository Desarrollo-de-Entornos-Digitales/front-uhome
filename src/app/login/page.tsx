"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { InputText } from "../../components/ui/InputText";
import { InputPassword } from "../../components/ui/InputPassword";
import { Button } from "../../components/ui/Button";

import { login } from "../../services/auth";
import {
  getRememberedEmail,
  getRememberMe,
  saveSession,
} from "../../services/session";

import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const rememberedEmail =
      getRememberedEmail();

    const remembered =
      getRememberMe();

    if (remembered) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await login({
        email,
        password,
      });

      saveSession(
        response.access_token,
        response.user,
        rememberMe,
      );

      router.push("/properties");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible iniciar sesión.",
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

          <InputPassword
            name="password"
            placeholder="Password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            autoComplete="current-password"
            required
          />

          <label className={styles.remember}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) =>
                setRememberMe(
                  event.target.checked,
                )
              }
            />

            <span>Remember me</span>
          </label>

          {error ? (
            <p
              className={styles.error}
              role="alert"
            >
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
            Log in
          </Button>

          <Link
            href="/forgot-password"
            className={styles.forgot}
          >
            Forgot password?
          </Link>
        </form>

        <div className={styles.divider} />

        <p className={styles.signup}>
          New here?{" "}
          <Link href="/register">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}