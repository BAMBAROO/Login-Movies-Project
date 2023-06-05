import { useEffect, useState } from "react";
import "./Dashboard.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [movie, setMovie] = useState("");
  const [movies, setMovies] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    console.log(movie);
  }, [movie]);

  const refreshToken = async () => {
    const response = await fetch("http://localhost:8000/token", {
      credentials: "include",
    });
    const result = await response.json();
    return result.accessToken;
  };

  const getMovie = async () => {
    const token = await refreshToken();
    const data = { movie: movie };
    const response = await fetch("http://localhost:8000/movie", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    setMovies(result);
  };

  const logOut = async () => {
    const response = await fetch("http://localhost:8000/logout", {
      method: "DELETE",
      credentials: "include"
    })
    if (response.ok === true) {
      Cookies.remove("statusLogin");
      return Navigate("/")
    }
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="logo">BAMBAR00</span>
        </div>
        <div className="logout-container">
          <button className="logout-button" onClick={logOut}>Logout</button>
        </div>
      </nav>

      <div className="container">
        <h1>Search Movies</h1>

        <div className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Enter your search movie"
            onChange={(e) => {
              setMovie(e.target.value);
            }}
          />
          <button
            className="movie-button"
            style={{ marginLeft: "5px", height: "40px" }}
            onClick={getMovie}
          >
            Search Movie
          </button>
        </div>
      </div>

      <hr />

      {movies ?
        movies.map((data) => {
          return (
            <>
              <div className="movie-box" key={data.imdbID}>
                <img
                  src={data.Poster}
                  alt={data.Title}
                  className="movie-poster"
                />
                <div className="movie-details">
                  <h2 className="movie-title">{data.Title}</h2>
                  <p className="movie-plot">{data.Plot}</p>
                  <p className="movie-year">Year: {data.Year}</p>
                  <p className="movie-rating">Rating: {data.imdbRating}</p>
                  <p className="movie-language">Language: {data.Languange}</p>
                  <p className="movie-actors">Actors: {data.Actors}</p>
                  <p className="movie-genre">Genre: {data.Genre}</p>
                </div>
              </div>
            </>
          );
        }) : <h3> WAIT....</h3>}
    </>
  );
}

export default Dashboard;
