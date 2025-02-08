"use client";
import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Link,
} from "@mui/material";
import { ZoomIn, Star, StarOutline } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function DogDetails({ dogDetails, favorites, toggleFavorite }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDogName, setSelectedDogName] = useState(null);
  const router = useRouter();

  // Fetch the favorite count from localStorage
  const favoriteCount = JSON.parse(
    localStorage.getItem("favorites") || "[]"
  ).length;

  const handleImageClick = (image, name) => {
    setSelectedImage(image);
    setSelectedDogName(name);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImage(null);
    setSelectedDogName(null);
  };

  const safeFavorites = Array.isArray(favorites) ? favorites : [];

  return (
    <div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#e0f7fa" }}>
            <th
              style={{
                padding: "8px",
                textAlign: "left",
                fontFamily: "Roboto, sans-serif",
              }}
            >
              Image
            </th>
            <th
              style={{
                padding: "8px",
                textAlign: "left",
                fontFamily: "Roboto, sans-serif",
              }}
            >
              Name
            </th>
            <th
              style={{
                padding: "8px",
                textAlign: "left",
                fontFamily: "Roboto, sans-serif",
              }}
            >
              Age
            </th>
            <th
              style={{
                padding: "8px",
                textAlign: "left",
                fontFamily: "Roboto, sans-serif",
              }}
            >
              Breed
            </th>
            <th
              style={{
                padding: "8px",
                textAlign: "left",
                fontFamily: "Roboto, sans-serif",
              }}
            >
              Zip Code
            </th>
            <th
              style={{
                padding: "8px",
                textAlign: "left",
                fontFamily: "Roboto, sans-serif",
              }}
            >
              {favoriteCount > 0 ? (
                <Link
                  href="/favorites"
                  style={{ color: "blue", textDecoration: "underline" }}
                >
                  Favorites ({favoriteCount})
                </Link>
              ) : (
                "Favorite"
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {dogDetails.map((dog) => (
            <tr key={dog.id}>
              <td
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => handleImageClick(dog.img, dog.name)}
              >
                <img
                  src={dog.img}
                  alt={dog.name}
                  style={{
                    width: "100px",
                    height: "auto",
                    cursor: "zoom-in",
                  }}
                />
                <IconButton
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    color: "white",
                  }}
                  size="large"
                >
                  <ZoomIn />
                </IconButton>
              </td>
              <td
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  fontFamily: "Roboto, sans-serif",
                }}
              >
                {dog.name}
              </td>
              <td
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  fontFamily: "Roboto, sans-serif",
                }}
              >
                {dog.age}
              </td>
              <td
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  fontFamily: "Roboto, sans-serif",
                }}
              >
                {dog.breed}
              </td>
              <td
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  fontFamily: "Roboto, sans-serif",
                }}
              >
                {dog.zip_code}
              </td>
              <td
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  fontFamily: "Roboto, sans-serif",
                }}
              >
                <IconButton onClick={() => toggleFavorite(dog.id)}>
                  {safeFavorites.includes(dog.id) ? <Star /> : <StarOutline />}
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dog Imag Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedDogName}</DialogTitle>
        <DialogContent>
          <img
            src={selectedImage}
            alt={selectedDogName}
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
