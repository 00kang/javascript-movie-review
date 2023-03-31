interface MovieResponse {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface Movie {
  id: number;
  poster_path: string;
  title: string;
  vote_average: number;
}

interface MovieDetailResponse {
  id: number;
  title: string;
  genres: { id: number; name: string }[];
  overview: string;
  poster_path: string;
  vote_average: number;
}

export { MovieResponse, Movie, MovieDetailResponse };