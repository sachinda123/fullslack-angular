import React, { Component } from "react";
import MovieService from "../services/movie.service";

export default class MovieTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movieData: {},
      showForm: false, // Add state for controlling form visibility
      formData: {
        name: "",
        email: "",
      },
    };

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      movieData: MovieService.getMovies(),
    });
  }

  // handleButtonClick() {
  //   // Toggle form visibility
  //   this.setState({ showForm: true });
  // }

  // handleInputChange(event) {
  //   const { name, value } = event.target;
  //   this.setState((prevState) => ({
  //     formData: {
  //       ...prevState.formData,
  //       [name]: value,
  //     },
  //   }));
  // }

  render() {
    const { movieData } = this.state;

    return (
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col-2">Image</th>
            <th scope="col-4">title</th>
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
                <img src={"https://image.tmdb.org/t/p/w200" + item.backdrop_path} alt="" width="100" height="100" className="container-image" />
              </th>
              <th scope="col-4">{item.title}</th>
              <th scope="col-2">Genere</th>
              <th scope="col-1">{item.vote_average}</th>
              <th scope="col-2">{item.release_date}</th>
              <th scope="col-1">
                <i className="fa">&#xf06e;</i>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
