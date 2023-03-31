import { Movie } from "../../types";
import starImg from "../../assets/star_filled.png";

class MovieCard {
  static render(movie: Movie) {
    return /*html*/ `
      <li data-id="${movie.id}" class="movie">
          <div class="item-card">
            <img
              class="item-thumbnail skeleton"
              src="https://image.tmdb.org/t/p/w220_and_h330_face/${movie.poster_path}"
              loading="lazy"
              alt="${movie.title}"
            />
            <p class="item-title">${movie.title}</p>
            <p class="item-score"><img src="${starImg}" alt="별점" />${movie.vote_average}</p>
          </div>
      </li>
    `;
  }
}

export { MovieCard };