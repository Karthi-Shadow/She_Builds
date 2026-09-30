import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import "./App.css";


// Home Page
function Home() {

  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("all");


  const searchMovies = async () => {

    if (search.trim() === "") {
      setError("Please enter a movie name");
      return;
    }

    setLoading(true);
    setError("");
    setMovies([]);

    try {

      const apiKey = import.meta.env.VITE_OMDB_API_KEY;

      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${apiKey}&s=${search}`
      );

      const data = await response.json();


      if (data.Response === "True") {

        setMovies(data.Search);

      } else {

        setError(data.Error);

      }

    } catch (error) {

      setError("Something went wrong");

    }

    setLoading(false);
  };


  return (

    <div>

      <h1>🎬 Movie Explorer</h1>


      {/* Search */}

      <div className="search-box">

        <input
          type="text"
          placeholder="Enter movie name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {

            if (e.key === "Enter") {
              searchMovies();
            }

          }}
        />

        <button onClick={searchMovies}>
          Search
        </button>

      </div>


      {/* Category Filters */}

      <div className="filters">

        <button onClick={() => setCategory("all")}>
          All
        </button>

        <button onClick={() => setCategory("movie")}>
          Movies
        </button>

        <button onClick={() => setCategory("series")}>
          Series
        </button>

      </div>


      {/* Loading */}

      {loading && (
        <h2 className="loading">
          Loading...
        </h2>
      )}


      {/* Error */}

      {error && (
        <p className="error">
          {error}
        </p>
      )}


      {/* Movie List */}

      <div className="movie-list">

        {movies
          .filter((movie) => {

            if (category === "all") {
              return true;
            }

            return movie.Type === category;

          })
          .map((movie) => (

            <MovieCard
              key={movie.imdbID}
              movie={movie}
            />

          ))}

      </div>

    </div>

  );
}


// Movie Card
function MovieCard({ movie }) {

  return (

    <div className="movie-card">


      {/* Movie Poster */}

      {movie.Poster !== "N/A" ? (

        <img
          src={movie.Poster}
          alt={movie.Title}
        />

      ) : (

        <div className="no-poster">
          No Image
        </div>

      )}


      {/* Movie Information */}

      <h2>
        {movie.Title}
      </h2>

      <p>
        Year: {movie.Year}
      </p>

      <p>
        Type: {movie.Type}
      </p>


      {/* Details Button */}

      <Link to={`/movie/${movie.imdbID}`}>

        <button>
          View Details
        </button>

      </Link>

    </div>

  );
}


// Movie Details Page
function MovieDetails() {

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);


  // Get movie ID from URL

  const id = window.location.pathname.split("/")[2];


  // Get movie details

  useEffect(() => {

    const getMovieDetails = async () => {

      try {

        const apiKey = import.meta.env.VITE_OMDB_API_KEY;

        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&i=${id}&plot=full`
        );

        const data = await response.json();

        setMovie(data);

      } catch (error) {

        console.log(error);

      }

      setLoading(false);

    };


    getMovieDetails();

  }, [id]);


  // Loading

  if (loading) {
    return (
      <h2 className="loading">
        Loading...
      </h2>
    );
  }


  // Error

  if (!movie || movie.Response === "False") {

    return (
      <h2>
        Movie not found
      </h2>
    );

  }


  return (

    <div className="details">


      {/* Back Button */}

      <Link to="/">

        <button>
          ← Back
        </button>

      </Link>


      {/* Movie Title */}

      <h1>
        {movie.Title}
      </h1>


      {/* Poster */}

      {movie.Poster !== "N/A" && (

        <img
          src={movie.Poster}
          alt={movie.Title}
        />

      )}


      {/* Movie Details */}

      <p>
        <b>Year:</b> {movie.Year}
      </p>

      <p>
        <b>Genre:</b> {movie.Genre}
      </p>

      <p>
        <b>Director:</b> {movie.Director}
      </p>

      <p>
        <b>Actors:</b> {movie.Actors}
      </p>

      <p>
        <b>IMDb Rating:</b> ⭐ {movie.imdbRating}
      </p>

      <p>
        <b>Runtime:</b> {movie.Runtime}
      </p>

      <p>
        <b>Language:</b> {movie.Language}
      </p>

      <p>
        {movie.Plot}
      </p>


    </div>

  );
}


// Main App
function App() {

  return (

    <BrowserRouter>

      {/* Navigation */}

      <nav>

        <Link to="/">
          🎬 Movie Explorer
        </Link>

      </nav>


      {/* Routes */}

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/movie/:id"
          element={<MovieDetails />}
        />

      </Routes>

    </BrowserRouter>

  );
}


export default App;