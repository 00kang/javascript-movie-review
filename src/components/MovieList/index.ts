import { Movies } from "../../domain/Movies";
import { MovieResponse } from "../../types";
import { fetchPopularMovies, fetchSearchMovies } from "../../utils/api";
import { $ } from "../../utils/selector";
import { getSkeletonContainer } from "../../utils/skeleton";
import { MovieCard } from "../MovieCard";

type showType = "popular" | "search";

interface State {
  show: showType;
  searchKeyword: string;
  page: number;
}

class MovieList {
  #$target;

  #state: State = {
    show: "popular",
    searchKeyword: "",
    page: 1,
  };

  #movies: Movies = new Movies([]);

  #$skeletonContainer = getSkeletonContainer();

  constructor($target: Element, onClickMovie: (movieId: number) => void) {
    this.#$target = $target;
    this.renderSkeleton();
    this.init();

    $(".btn").addEventListener("click", this.onClickMoreButton.bind(this));
    $(".item-list").addEventListener("click", (event) => {
      const closestLi = (event.target as HTMLElement).closest("li");
      const clickedId = closestLi?.dataset.id;

      if (clickedId === "0" || clickedId === null || clickedId === undefined) {
        throw new Error("유효하지 않은 id 값입니다.");
      }

      if (clickedId) {
        const movieId = parseInt(clickedId, 10);

        onClickMovie(movieId);
      }
    });
  }

  async init() {
    this.renderSkeleton();

    const response = await fetchPopularMovies(this.#state.page);
    const { results, total_pages } = response;
    this.#movies.reset(results);

    this.renderMovieList(total_pages);
    this.infiniteScroll();
  }

  async reset(state: showType, searchKeyword?: string) {
    this.#$target.innerHTML = ``;

    this.#state = { ...this.#state, show: state, page: 1 };
    this.showMoreButton();
    this.removeSkeleton();

    if (state === "popular") {
      const response = await fetchPopularMovies(this.#state.page);
      const { results, total_pages } = response;
      this.#movies.reset(results);

      this.renderMovieList(total_pages);
      return;
    }

    if (searchKeyword) {
      this.#state = { ...this.#state, searchKeyword: searchKeyword };

      const response = await fetchSearchMovies(
        this.#state.page,
        this.#state.searchKeyword
      );
      const { results, total_pages } = response;
      this.#movies.reset(results);

      this.renderMovieList(total_pages);
    }
  }

  renderMovieList(total_pages: number) {
    this.#$target.innerHTML = `
      ${this.#movies
        .getList()
        .map((movie) => MovieCard.render(movie))
        .join("")}
    `;

    if (this.#state.page === total_pages) this.hideMoreButton();
  }

  renderNextMovies(movieList: MovieResponse[], total_pages: number) {
    this.removeSkeleton();

    this.#$target.insertAdjacentHTML(
      "beforeend",
      `${movieList.map((movie) => MovieCard.render(movie)).join("")}`
    );
    this.#movies.add(movieList);

    if (this.#state.page === total_pages) this.hideMoreButton();
  }

  infiniteScroll() {
    const options = {
      rootMargin: "0px 0px 500px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => {
          this.onClickMoreButton();
        }, 300);
      }
    }, options);

    observer.observe($(".btn"));
  }

  async onClickMoreButton() {
    this.#state.page += 1;
    this.renderSkeleton();

    if (this.#state.show === "popular") {
      const response = await fetchPopularMovies(this.#state.page);
      const { results, total_pages } = response;

      this.renderNextMovies(results, total_pages);
    }

    if (this.#state.show === "search") {
      const response = await fetchSearchMovies(
        this.#state.page,
        this.#state.searchKeyword
      );
      const { results, total_pages } = response;

      this.renderNextMovies(results, total_pages);
    }
  }

  renderSkeleton() {
    this.#$target.insertAdjacentElement("afterend", this.#$skeletonContainer);
  }

  removeSkeleton() {
    $(".skeleton-list").remove();
  }

  hideMoreButton() {
    $(".btn").setAttribute("hidden", "");
  }

  showMoreButton() {
    $(".btn").removeAttribute("hidden");
  }
}

export { MovieList };