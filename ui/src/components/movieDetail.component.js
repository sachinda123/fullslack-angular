import React, { useState, useEffect } from "react";
import { getSingleMovie } from "../services/movie.service";

const MovieDetail = ({ id, handle }) => {
  const [movieData, setMovieData] = useState({});

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getSingleMovie(id);
        setMovieData(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [id]);

  const generateRating = (vote) => {
    return (
      <>
        <i className="bi bi-star"></i>
        <i className="bi bi-star-fill"></i>
        <i className="bi bi-star-half"></i>
        <i className="bi bi-star"></i>
      </>
    );
  };

  console.log("movieData", movieData);

  return (
    <div className="movie-detail-container">
      <div className="movie-detail-left">
        <button onClick={handle} className="reverseButton">
          Home
        </button>
        {">"} {movieData?.title}
        <div className="movie-detail-image">
          <img src={"https://image.tmdb.org/t/p/original" + movieData.poster_path} alt="" />
        </div>
      </div>
      <div className="movie-detail-right">
        <h2>{movieData?.title}</h2>
        <div className="row">
          <div className="col-10">
            <h1>{new Date(movieData.release_date).getFullYear()}</h1>
          </div>
          <div className="col-2">
            <button className="wish-list-btn">
              <i className="bi bi-bookmark-fill"></i>
            </button>
          </div>
        </div>

        <div className="title">Reviews</div>
        <div className="row">
          <div className="col-10 vote-container">
            <div className="vote">{movieData && movieData.vote_average && movieData.vote_average.toFixed(1)}</div>
            <div className="vote-total">/10</div>
          </div>
          <div className="col-2 star">{generateRating(movieData.vote_average)}</div>
        </div>
        <div className="title">Synopis</div>
        <p>{movieData.overview}</p>
      </div>
    </div>
  );
};

export default MovieDetail;
