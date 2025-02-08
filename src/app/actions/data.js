"use server";

import { cookies } from "next/headers";

// Helper function to get the token from cookies
async function getAuthToken() {
  const cookieStore = await cookies();
  const authTokenCookie = cookieStore.get("fetch-access-toekn");

  if (!authTokenCookie) {
    throw new Error("Unauthorized: No token found");
  }

  const cookieString = authTokenCookie.value;
  const match = cookieString.match(/fetch-access-token=([^;]+)/);
  const token = match ? match[1] : null;

  if (!token) {
    throw new Error("Invalid token format");
  }

  return token;
}

// Fetch list of breeds
export async function getBreeds() {
  try {
    const token = await getAuthToken();
    const res = await fetch(
      "https://frontend-take-home-service.fetch.com/dogs/breeds",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `fetch-access-token=${token}`,
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Unauthorized: Token expired");
      }
      throw new Error("Failed to fetch breeds");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching breeds:", error);
    throw error;
  }
}

// Fetch match for the favorites
export async function findMatch(favorites) {
  try {
    const token = await getAuthToken();
    const response = await fetch(
      "https://frontend-take-home-service.fetch.com/dogs/match",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `fetch-access-token=${token}`,
        },
        body: JSON.stringify(favorites),
      }
    );

    if (!response.ok) {
      console.error("Failed to find match");
      return null;
    }

    const { match } = await response.json();

    if (!match) {
      console.error("No match found");
      return null;
    }

    return match;
  } catch (error) {
    console.error("Error finding match:", error);
    return null;
  }
}

// Fetch search results based on search parameters
export async function searchDogs(searchParams = {}, from = null) {
  try {
    const token = await getAuthToken();
    let searchUrl;

    if (from !== null) {
      searchParams.from = from;
    }

    let queryParams = new URLSearchParams(searchParams);
    queryParams.set("size", "25");

    searchUrl = `https://frontend-take-home-service.fetch.com/dogs/search?${queryParams.toString()}`;

    const res = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `fetch-access-token=${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Unauthorized: Token expired");
      }
      throw new Error("Failed to fetch search data");
    }

    const responseData = await res.json();
    return {
      dogs: responseData.resultIds || [],
      nextPageUrl: responseData.next || null,
      prevPageUrl: responseData.prev || null,
      total: responseData.total || 0,
    };
  } catch (error) {
    console.error("Error fetching dogs:", error);
    throw error;
  }
}

// Fetch dog details by IDs
export async function getDogDetailsByIds(ids) {
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    console.error("🚨 Invalid or empty IDs provided:", ids);
    return [];
  }

  const BATCH_SIZE = 100;
  const token = await getAuthToken();
  let allResults = [];

  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);

    try {
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/dogs/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `fetch-access-token=${token}`,
          },
          body: JSON.stringify(batch),
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Token expired");
        }
        console.error(`❌ Error fetching batch: ${response.status}`);
        continue;
      }

      const data = await response.json();
      allResults = [...allResults, ...data];
    } catch (error) {
      console.error("❌ Fetch error in getDogDetailsByIds:", error);
    }
  }

  return allResults;
}
