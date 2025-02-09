# Dog Finder

Dog Finder is a React-based web application that lets users search for dog breeds, view detailed breed information, and mark their favorite breeds. Once you've generated a list of favorites, you can easily find your perfect match! The app utilizes Material-UI components for a modern user interface and integrates with a backend API to fetch real-time dog data.

## Features

- Search for dog breeds and view details.
- Mark your favorite breeds and view them later.
- Find your perfect match from your list of favorites.
- Responsive design that adjusts for mobile and desktop views.
- Persistent authentication and session handling.
- Responsive Drawer navigation on mobile devices with close functionality.

## Technologies Used

- **React** (with Next.js)
- **Material-UI** (for styling and UI components)
- **MUI Drawer** (for mobile navigation)
- **IconButton** (for interactive icons like zoom and favorites)
- **Dialog** (to display dog images in a modal)
- **LocalStorage** (to store and retrieve favorite dog breeds)

## Installation

To run this project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/dog-finder.git
   cd dog-finder
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the application:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Search**: Use the search functionality to find dogs.
2. **Favorites**: Click on the heart icon to add dogs to your favorites.
3. **View Details**: Click on a dog's image to view its detailed information in a modal.
4. **Mobile Navigation**: On mobile, tap the hamburger menu icon to access navigation links.

## Configuration

Make sure you have your own API endpoint set up or modify the API URL in the project to your desired backend. The current setup fetches data from a mock dog breeds API.
