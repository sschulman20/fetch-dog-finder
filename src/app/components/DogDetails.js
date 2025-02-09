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
  Typography,
  Chip,
} from "@mui/material";
import { ZoomIn, Star, StarOutline, Favorite } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function DogDetails({
  dogDetails = [],
  favorites,
  toggleFavorite,
}) {
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
      {/* Favorite Link with Button */}
      {favoriteCount > 0 ? (
        <Typography variant="h6" sx={{ marginBottom: "16px" }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => router.push("/favorites")}
            startIcon={<Favorite />}
          >
            Favorites ({favoriteCount})
          </Button>
        </Typography>
      ) : (
        <Typography variant="h6" sx={{ marginBottom: "16px" }}>
          No favorites yet
        </Typography>
      )}

      {/* Dog Cards */}
      <div className="dog-cards">
        {dogDetails.length > 0 ? (
          dogDetails.map((dog) => (
            <div key={dog.id} className="dog-card">
              <div
                className="dog-card-image"
                onClick={() => handleImageClick(dog.img, dog.name)}
              >
                <img src={dog.img} alt={dog.name} className="dog-image" />
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
              </div>
              <div className="dog-card-info">
                <Typography variant="h6">{dog.name}</Typography>
                <Typography variant="body2">Age: {dog.age}</Typography>
                <Typography variant="body2">Breed: {dog.breed}</Typography>
                <Typography variant="body2">
                  Zip Code: {dog.zip_code}
                </Typography>
                <IconButton onClick={() => toggleFavorite(dog.id)}>
                  {safeFavorites.includes(dog.id) ? <Star /> : <StarOutline />}
                </IconButton>
              </div>
            </div>
          ))
        ) : (
          <Typography variant="h6">No dogs found</Typography>
        )}
      </div>

      {/* Dog Image Dialog */}
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

      <style jsx>{`
        .dog-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }

        .dog-card {
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          position: relative;
        }

        .dog-card-image {
          position: relative;
          width: 250px;
          height: 250px;
          overflow: hidden;
          display: flex; /* Use flexbox for centering */
          justify-content: center; /* Center horizontally */
          align-items: center; /* Center vertically */
        }

        .dog-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dog-card-info {
          padding: 16px;
        }

        .dog-card-info h6 {
          margin: 8px 0;
        }

        .dog-card-info p {
          margin: 4px 0;
        }

        /* Center content for xs */
        @media (max-width: 600px) {
          .dog-cards {
            grid-template-columns: 1fr;
          }

          .dog-card-info {
            padding: 8px;
            text-align: center; /* Centers text */
          }

          .dog-card-image {
            width: 100%; /* Make the image container take full width on mobile */
            height: auto; /* Let the height adjust based on aspect ratio */
          }

          .dog-card-image img {
            max-width: 100%; /* Ensure the image scales correctly */
            height: auto; /* Maintain aspect ratio */
          }
        }
      `}</style>
    </div>
  );
}
