import { Movie } from '../index.d';
import { ERROR_2XX } from '../constants';

import ErrorRender from '../components/ErrorRender';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TOKEN}`,
  },
};

class MovieStore {
  #moviesData: any[];

  #pageCount: number = 1;

  constructor() {
    this.#moviesData = [];
  }

  async getMovies() {
    try {
      const responseData = await this.#fetchMoviesData();
      this.#pushNewData(responseData);
      return responseData;
    } catch (error) {
      console.error(error);
    }
  }

  /* eslint-disable max-lines-per-function */
  async #fetchMoviesData() {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?language=ko&page=${this.#pageCount}`,
      options,
    );

    if (!response.ok) {
      throw new ErrorRender(String(response.status)).renderError();
    }

    const responseJSON = await response.json();

    if (String(response.status)[0] === ERROR_2XX && responseJSON.results.length === 0) {
      throw new ErrorRender(String(response.status)).renderError();
    }

    return responseJSON.results;
  }

  increasePageCount() {
    this.#pageCount += 1;
  }

  #pushNewData(data: Movie[]) {
    if (data) {
      this.#moviesData.push(...data);
    }
  }

  get movies() {
    return this.#moviesData;
  }
}

const movieStore = new MovieStore();

export default movieStore;
