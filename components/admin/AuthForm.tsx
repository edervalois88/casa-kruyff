"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { adminRequest } from "./api";

export default function AuthForm({ setup = false }: { setup?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    adminRequest<{ authenticated: boolean; setupRequired: boolean }>("session").then(session => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("password") === "updated") setNotice("Contraseña actualizada. Inicie sesión con su nueva contraseña.");
      if (params.get("created") === "1") setNotice("Cuenta creada. Ya puede iniciar sesión.");
      if (session.authenticated) window.location.replace("/admin");
      else if (session.setupRequired && !setup) window.location.replace("/admin/setup");
      else if (!session.setupRequired && setup) window.location.replace("/admin/login");
      else setReady(true);
    }).catch(e => { setError(e.message); setReady(true); });
  }, [setup]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const fields = new FormData(event.currentTarget);
    const email = String(fields.get("email") || "");
    const password = String(fields.get("password") || "");
    try {
      if (setup) {
        await adminRequest("setup", { method: "POST", body: JSON.stringify({ token: fields.get("token"), email, password }) });
      } else {
        const result = await authClient.signIn.email({ email, password, callbackURL: "/admin" });
        if (result.error) throw new Error(result.error.message || "Correo o contraseña incorrectos.");
      }
      window.location.replace("/admin");
    } catch (e) {
      setError((e as Error).message || "No fue posible completar el acceso.");
      setBusy(false);
    }
  }

  return <main className="admin-auth"><section className="admin-auth-card">
    <Link href="/" className="admin-brand">CASA KRUYFF <span>Administración</span></Link>
    <h1>{setup ? "Crear acceso privado" : "Bienvenido de nuevo"}</h1>
    <p>{setup ? "Configure la cuenta que administrará el catálogo y los contenidos de Casa Kruyff." : "Acceda para cuidar su catálogo, colecciones y contenidos."}</p>
    {notice && <p className="admin-success" role="status">{notice}</p>}
    {error && <p className="admin-alert" role="alert">{error}</p>}
    {!ready ? <p role="status">Verificando acceso…</p> : <form onSubmit={submit}>
      {setup && <label>Clave de configuración<input name="token" type="password" required autoComplete="off" /><small>Use la clave privada guardada en el archivo .data/admin-setup-token.txt del proyecto.</small></label>}
      <label>Correo electrónico<input type="email" name="email" required autoComplete="username" /></label>
      <label>Contraseña<input type="password" name="password" required minLength={setup ? 12 : undefined} autoComplete={setup ? "new-password" : "current-password"} />{setup && <small>Al menos 12 caracteres. Guárdela en un lugar seguro.</small>}</label>
      <button className="admin-primary" disabled={busy}>{busy ? "Verificando…" : setup ? "Crear cuenta" : "Entrar"}</button>
    </form>}
    <Link href="/" className="admin-back">Volver al sitio</Link>
  </section></main>;
}
