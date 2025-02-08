"use client";

import { useRouter } from "next/navigation";
import LoginForm from "./components/LoginForm";
import { login } from "./actions/auth";

export default function Page() {
  const router = useRouter();

  async function handleLogin(name, email) {
    await login(name, email);
    router.push("/dashboard"); // Redirect to dashboard
  }

  return (
    <main>
      <LoginForm onLogin={handleLogin} />
    </main>
  );
}
