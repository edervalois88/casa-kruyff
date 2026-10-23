"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminRequest } from "./api";

export default function AuthForm({ setup = false }: { setup?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  useEffect(() => {
    adminRequest<{ authenticated: boolean; setupRequired: boolean }>("session").then(s => {
      setPasswordUpdated(new URLSearchParams(window.location.search).get("password") === "updated");
      if (s.authenticated) window.location.replace("/admin");
      else if (s.setupRequired && !setup) window.location.replace("/admin/setup");
      else if (!s.setupRequired && setup) window.location.replace("/admin/login");
      else setReady(true);
    }).catch(e => { setError(e.message); setReady(true); });
  }, [setup]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const fields = new FormData(event.currentTarget);
    try {
      await adminRequest(setup ? "setup" : "login", { method: "POST", body: JSON.stringify(Object.fromEntries(fields)) });
      window.location.replace("/admin");
    } catch (e) { setError((e as Error).message); setBusy(false); }
  }
  return <main className="admin-auth"><section className="admin-auth-card"><Link href="/" className="admin-brand">CASA KRUYFF <span>Administración</span></Link><h1>{setup ? "Crear acceso privado" : "Bienvenido de nuevo"}</h1><p>{setup ? "Configure la cuenta que administrará el catálogo y los contenidos de Casa Kruyff." : "Acceda para cuidar su catálogo, colecciones y contenidos."}</p>{passwordUpdated && <p className="admin-success" role="status">Contraseña actualizada. Inicie sesión con su nueva contraseña.</p>}{error && <p className="admin-alert" role="alert">{error}</p>}{!ready ? <p role="status">Verificando acceso…</p> : <form onSubmit={submit}>
    {setup && <label>Clave de configuración<input name="token" type="password" required autoComplete="off" /><small>Use la clave privada del archivo .data/admin-setup-key.txt del servidor.</small></label>}
    <label>Correo electrónico<input type="email" name="email" required autoComplete="username" /></label><label>Contraseña<input type="password" name="password" required minLength={setup ? 12 : undefined} autoComplete={setup ? "new-password" : "current-password"} />{setup && <small>Al menos 12 caracteres. Guárdela en un lugar seguro.</small>}</label><button className="admin-primary" disabled={busy}>{busy ? "Verificando…" : setup ? "Crear cuenta" : "Entrar"}</button></form>}<Link href="/" className="admin-back">Volver al sitio</Link></section></main>;
}
