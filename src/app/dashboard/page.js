"use client";

import { useState, useEffect } from "react";
import { searchDogs, getBreeds, getDogDetailsByIds } from "../actions/data";
import { useRouter } from "next/navigation";
import DogDetails from "../components/DogDetails";
import {
  Button,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Pagination,
  Stack,
} from "@mui/material";

export default function Dashboard() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    breeds: "",
    sort: "breed:asc",
  });
  const [results, setResults] = useState(null);
  const [dogDetails, setDogDetails] = useState(null);
  const [breeds, setBreeds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDogs, setTotalDogs] = useState(0);
  const router = useRouter();

  // Load favorites from local storage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    setFavorites(savedFavorites ? JSON.parse(savedFavorites) : []);

    async function fetchInitialData() {
      try {
        const searchParamsObj = {
          size: 25,
          sort: "breed:asc",
          from: 0,
        };

        // Only add the 'breeds' parameter if it exists
        if (searchParams.breeds) {
          searchParamsObj.breeds = searchParams.breeds;
        }

        const dogsData = await searchDogs(searchParamsObj);
        //console.log("Search Result:", dogsData);
        setResults(dogsData.dogs);
        setTotalDogs(dogsData.total);
        setTotalPages(Math.ceil(dogsData.total / 25));
        setCurrentPage(1);

        if (dogsData.dogs.length > 0) {
          await fetchDogDetails(dogsData.dogs);
        }
      } catch (error) {
        if (error.message.includes("Token expired")) {
          router.push("/");
        } else {
          setError("Failed to fetch dog data.");
        }
      }
    }

    fetchInitialData();

    async function fetchBreeds() {
      try {
        const breedsData = await getBreeds();
        setBreeds(breedsData);
      } catch (error) {
        if (error.message.includes("Token expired")) {
          router.push("/");
        } else {
          setError("Failed to fetch breeds.");
        }
      }
    }

    fetchBreeds();
  }, [router]);

  // Toggle favorite and save
  const toggleFavorite = (dogId) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = Array.isArray(prevFavorites)
        ? prevFavorites.includes(dogId)
          ? prevFavorites.filter((id) => id !== dogId)
          : [...prevFavorites, dogId]
        : [dogId];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setDogDetails(null);

    try {
      let searchParamsObj = { sort: searchParams.sort, size: 25 };
      if (searchParams.breeds) {
        searchParamsObj.breeds = [searchParams.breeds];
      }
      const searchResult = await searchDogs(searchParamsObj);
      console.log("Search Result:", searchResult);
      setResults(searchResult.dogs);
      setTotalDogs(searchResult.total);
      setTotalPages(Math.ceil(searchResult.total / 25));
      setCurrentPage(1);
      await fetchDogDetails(searchResult.dogs);
    } catch (error) {
      setError("Failed to search dogs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDogDetails = async (dogIds) => {
    try {
      const dogDetailsData = await getDogDetailsByIds(dogIds);
      setDogDetails(dogDetailsData);
    } catch (error) {
      setError("Failed to fetch dog details.");
    }
  };

  const handlePageChange = async (event, page) => {
    setLoading(true);
    try {
      // Ensure the 'from' value doesn't exceed the total number of dogs
      const from = Math.min((page - 1) * 25, totalDogs - 25);

      // Ensure breeds is only included if not empty
      let searchParamsObj = { ...searchParams, from };

      // Remove the 'breeds' parameter if it's empty
      if (!searchParams.breeds) {
        delete searchParamsObj.breeds;
      }

      const searchResult = await searchDogs(searchParamsObj);
      //console.log("Search Result:", searchResult);
      setResults(searchResult.dogs);
      setCurrentPage(page);
      await fetchDogDetails(searchResult.dogs);
    } catch (error) {
      setError("Failed to fetch dogs for the selected page.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Typography variant="h4" gutterBottom>
        Search Available Dogs
      </Typography>
      <form onSubmit={handleSearchSubmit}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "flex-end" }}
          sx={{ marginBottom: "24px" }}
        >
          <div>
            <Typography variant="h6">Breed</Typography>
            <Select
              name="breeds"
              value={searchParams.breeds}
              onChange={(e) =>
                setSearchParams({ ...searchParams, breeds: e.target.value })
              }
              fullWidth
              size="small"
              style={{ width: "300px" }}
            >
              <MenuItem value="">No breed</MenuItem>
              {breeds.map((breed, index) => (
                <MenuItem key={index} value={breed}>
                  {breed}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <Typography variant="h6">Sort by</Typography>
            <Select
              name="sort"
              value={searchParams.sort}
              onChange={(e) =>
                setSearchParams({ ...searchParams, sort: e.target.value })
              }
              fullWidth
              size="small"
            >
              <MenuItem value="breed:asc">Breed Ascending</MenuItem>
              <MenuItem value="breed:desc">Breed Descending</MenuItem>
              <MenuItem value="name:asc">Name Ascending</MenuItem>
              <MenuItem value="name:desc">Name Descending</MenuItem>
              <MenuItem value="age:asc">Age Ascending</MenuItem>
              <MenuItem value="age:desc">Age Descending</MenuItem>
            </Select>
          </div>
          <Button type="submit" variant="contained" color="primary">
            Search
          </Button>
        </Stack>
      </form>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Typography variant="h5" sx={{ marginBottom: "24px" }}>
        Total Dogs: {totalDogs}
      </Typography>

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        shape="rounded"
        color="primary"
        showFirstButton
        showLastButton
        siblingCount={{ xs: 1, sm: 2 }}
        sx={{ marginBottom: "24px" }}
      />

      {dogDetails && (
        <DogDetails
          dogDetails={dogDetails}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      )}

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        shape="rounded"
        color="primary"
        showFirstButton
        showLastButton
        siblingCount={{ xs: 1, sm: 2 }}
        sx={{ marginTop: "24px" }}
      />
    </main>
  );
}
