"use server";

import { cookies } from "next/headers";

// Login function: authenticate and set the auth cookie
export async function login(name, email) {
  const res = await fetch(
    "https://frontend-take-home-service.fetch.com/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, email }),
    }
  );

  if (!res.ok) {
    console.error("Login failed", await res.text());
    throw new Error("Login failed");
  }

  // Get the Set-Cookie header from the response
  const setCookieHeader = res.headers.get("set-cookie");
  if (setCookieHeader) {
    const cookie = await cookies();

    // Set the cookie with necessary options
    await cookie.set("fetch-access-toekn", setCookieHeader, {
      httpOnly: true,
      path: "/",
      sameSite: "None",
      secure: true,
    });
  } else {
    console.error("No auth cookie received!");
  }

  return { success: true };
}

// Logout function: remove the auth cookie and log out
export async function logout() {
  // Perform logout request
  await fetch("https://frontend-take-home-service.fetch.com/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  // Await cookies to delete the auth cookie
  const cookie = await cookies();
  cookie.delete("fetch-access-toekn");

  return { success: true };
}

// Retrieve the auth cookie (for example, to use in API requests)
export async function getCookie() {
  try {
    // Await cookies() to access them asynchronously
    const cookie = await cookies();

    // Retrieve the auth token
    const authToken = cookie.get("fetch-access-toekn");

    if (authToken) {
      return authToken.value;
    }

    return null;
  } catch (error) {
    console.error("Error getting cookie:", error);
    return null;
  }
}
