import React, { useState, useEffect } from "react";
import MovieDetail from "../components/movieDetail.component";
import MovieTable from "../components/movietable.component";
import Menu from "./menu.component";
import { useSelector, useDispatch } from "react-redux";
import { fetchMovies } from "../actions/movieActions";

const Home = () => {
  const dispatch = useDispatch();
  const [movieId, setMovieId] = useState("");
  const [pageId, setPageId] = useState(1);
  const { loading, movies, error } = useSelector((state) => state.movies);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [sortOrder, setSortOrder] = useState("Asc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchMovies(pageId));
  }, [dispatch, pageId]);

  useEffect(() => {
    let filtered = movies;
    if (selectedYear) {
      filtered = movies.filter((movie) => new Date(movie.release_date).getFullYear().toString() === selectedYear);
    }
    if (selectedRating) {
      filtered = filtered.filter((movie) => Math.floor(movie.vote_average) === parseInt(selectedRating));
    }
    if (sortOrder) {
      filtered = filtered.sort((a, b) => {
        if (sortOrder === "Asc") {
          return a.title.localeCompare(b.title);
        } else if (sortOrder === "Desc") {
          return b.title.localeCompare(a.title);
        } else {
          return 0;
        }
      });
    }

    setFilteredMovies(filtered);
  }, [selectedYear, movies, selectedRating, sortOrder]);

  const handleClick = (item) => {
    item ? setMovieId(item.id) : setMovieId("");
  };

  const handlePageClick = (id) => {
    setPageId(id);
  };
  const handleChange = (type, event) => {
    switch (type) {
      case "year":
        setSelectedYear(event.target.value);
        break;
      case "rating":
        setSelectedRating(event.target.value);
        break;
      case "orderby":
        setSortOrder(event.target.value);
        break;
      case "search":
        setSearchQuery(event.target.value);
        break;
      case "searchBtn":
        setSearchQuery(event.target.value);
        break;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container">
      {!movieId ? (
        <>
          <Menu handleChange={handleChange} selectedYear={selectedYear} selectedRating={selectedRating} sortOrder={sortOrder} searchQuery={searchQuery} />
          <MovieTable movieList={filteredMovies} handleClick={handleClick} />
        </>
      ) : (
        <MovieDetail id={movieId} handle={handleClick} />
      )}
      {!movieId && (
        <div className="pagination">
          <button className="nav-left" onClick={() => handlePageClick("prev")}>
            &laquo;
          </button>
          <button onClick={() => handlePageClick(1)}>1</button>
          <button className="active" onClick={() => handlePageClick(2)}>
            2
          </button>
          <button className="nav-right" onClick={() => handlePageClick("next")}>
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
