import React, { useState, useEffect } from "react";
import { getMovies } from "../services/movie.service";
import MovieDetail from "../components/movieDetail.component";

const Home = () => {
  const [movieData, setMovieData] = useState({});
  const [movieId, setMovieId] = useState("");
  const [pageId, setPageId] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies(pageId);
        setMovieData(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [pageId]);

  const handleClick = (item) => {
    item ? setMovieId(item.id) : setMovieId("");
  };

  const handlePageClick = (id) => {
    setPageId(id);
  };

  return (
    <div className="container">
      {!movieId && (
        <>
          <div className="row">
            <div className="col-10">
              <div className="form-group has-search">
                <span className="fa fa-search form-control-feedback"></span>
                <input type="text" className="form-control" />
              </div>
            </div>
            <div className="col-2">
              <button className="rounded-button">Search</button>
            </div>
          </div>
          <div className="selectMenu">
            <div>
              <div>Genere:</div>
              <div>
                <select className="form-select rounded-button" aria-label="Default select example">
                  <option selected>select</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
            </div>
            <div>
              <div>Rating:</div>
              <div>
                <select className="form-select rounded-button" aria-label="Default select example">
                  <option selected>select</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
            </div>
            <div>
              <div>Year:</div>
              <div>
                <select className="form-select rounded-button" aria-label="Default select example">
                  <option selected>select</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
            </div>
            <div>
              <div>Order By:</div>
              <div>
                <select className="form-select rounded-button" aria-label="Default select example">
                  <option selected>select</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
            </div>
          </div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col-2">Image</th>
                <th scope="col-4">Title</th>
                <th scope="col-2">Genere</th>
                <th scope="col-1">Rating</th>
                <th scope="col-2">Year</th>
                <th scope="col-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {movieData.results?.map((item, index) => (
                <tr key={index}>
                  <th scope="col-2">
                    <img src={"https://image.tmdb.org/t/p/w200" + item.poster_path} alt="" width="100" height="100" className="container-image" />
                  </th>
                  <th scope="col-4">{item.title}</th>
                  <th scope="col-2">Genere</th>
                  <th scope="col-1">{item.vote_average.toFixed(1)}</th>
                  <th scope="col-2">{new Date(item.release_date).getFullYear()}</th>
                  <th scope="col-1" onClick={() => handleClick(item)}>
                    <i className="fa">&#xf06e;</i>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {movieId && <MovieDetail id={movieId} handle={handleClick} />}
      {!movieId && (
        <div className="pagination">
          <a href="#" className="nav-left">
            &laquo;
          </a>
          <a href="#" onClick={() => handlePageClick(1)}>
            1
          </a>
          <a href="#" className="active" onClick={() => handlePageClick(2)}>
            2
          </a>
          <a href="#" className="nav-right">
            &raquo;
          </a>
        </div>
      )}
    </div>
  );
};

export default Home;
