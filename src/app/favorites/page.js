"use client";
import { useEffect, useState } from "react";
import { getDogDetailsByIds, findMatch } from "../actions/data";
import { Button, Typography, Stack } from "@mui/material";
import DogDetails from "../components/DogDetails";
import { useRouter } from "next/navigation";

export default function Favorites() {
  const [favoriteDogs, setFavoriteDogs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [matchedDog, setMatchedDog] = useState(null); // State for matched dog
  const router = useRouter();

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);

    if (savedFavorites.length > 0) {
      getDogDetailsByIds(savedFavorites).then(setFavoriteDogs);
    }
  }, []);

  const handleFindMatch = async () => {
    const matchId = await findMatch(favorites); // Get match ID

    if (matchId) {
      // Fetch matched dog details based on match ID
      const matchDetails = await getDogDetailsByIds([matchId]);
      setMatchedDog(matchDetails[0]); // Set matched dog details
    } else {
      console.error("No valid match id");
    }
  };

  const handleNewSearch = () => {
    // Only clear favorites if a match has been found
    if (matchedDog) {
      localStorage.removeItem("favorites");
    }
    router.push("/dashboard"); // Navigate to dashboard for new search
  };

  return (
    <main>
      <Typography variant="h4" sx={{ marginBottom: "24px" }}>
        {matchedDog ? "Your Matched Dog" : "Your Favorite Dogs"}
      </Typography>

      {matchedDog ? (
        <div>
          <Typography variant="h5">{matchedDog.name}</Typography>
          <img
            src={matchedDog.img}
            alt={matchedDog.name}
            style={{ width: "300px", height: "auto" }}
          />
          <Typography>Age: {matchedDog.age}</Typography>
          <Typography>Breed: {matchedDog.breed}</Typography>
          <Typography>Zip Code: {matchedDog.zip_code}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNewSearch}
            sx={{ marginTop: "24px" }}
          >
            New Search
          </Button>
        </div>
      ) : (
        <>
          {favoriteDogs.length > 0 ? (
            <DogDetails
              dogDetails={favoriteDogs}
              favorites={favorites}
              toggleFavorite={() => {}}
            />
          ) : favorites.length === 0 ? (
            <div>
              <Typography sx={{ marginBottom: "24px" }}>
                You do not have any dogs selected!
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNewSearch} // Go to dashboard to search for dogs
                >
                  Search Dogs
                </Button>
              </Stack>
            </div>
          ) : (
            <Typography>No favorites selected.</Typography>
          )}

          {/* Render "Find My Match" button only if favorites exist */}
          {favorites.length > 0 && (
            <Stack direction="row" spacing={2} sx={{ marginTop: "24px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFindMatch}
                disabled={favorites.length === 0}
              >
                Find My Match
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNewSearch} // Go to dashboard to search for dogs
              >
                Search Dogs
              </Button>
            </Stack>
          )}
        </>
      )}
    </main>
  );
}
