"use client";

import { useCallback, useEffect, useEffectEvent, useState } from "react";

type Settled<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string };

export interface AsyncResult<T> {
  status: "loading" | "success" | "error";
  /** Datos de la petición actual. */
  data: T | undefined;
  /** Últimos datos exitosos, aunque correspondan a una petición anterior. */
  latestData: T | undefined;
  error: string | null;
  retry: () => void;
}

/**
 * Ejecuta `load` cada vez que cambia `key` (o al reintentar) y descarta
 * respuestas de peticiones anteriores.
 */
export function useAsync<T>(load: () => Promise<T>, key: string): AsyncResult<T> {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<{
    requestKey: string;
    result: Settled<T>;
  } | null>(null);
  const [latestData, setLatestData] = useState<T | undefined>(undefined);

  const requestKey = `${key}#${attempt}`;
  const runLoad = useEffectEvent(() => load());

  useEffect(() => {
    let active = true;

    runLoad().then(
      (data) => {
        if (!active) return;
        setSettled({ requestKey, result: { status: "success", data } });
        setLatestData(data);
      },
      (error: unknown) => {
        if (!active) return;
        setSettled({
          requestKey,
          result: {
            status: "error",
            error:
              error instanceof Error && error.message
                ? error.message
                : "No se pudo cargar la información.",
          },
        });
      },
    );

    return () => {
      active = false;
    };
  }, [requestKey]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  const current = settled?.requestKey === requestKey ? settled.result : null;

  return {
    status: current?.status ?? "loading",
    data: current?.status === "success" ? current.data : undefined,
    latestData,
    error: current?.status === "error" ? current.error : null,
    retry,
  };
}
