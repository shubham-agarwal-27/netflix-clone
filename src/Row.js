import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";
const baseUrl = "https://image.tmdb.org/t/p/original/";

function Row(props) {
	const [movies, setMovies] = useState([]);
	const [trailerUrl, setTrailerUrl] = useState("");
	useEffect(() => {
		async function fetchData() {
			const request = await axios.get(props.fetchUrl);
			setMovies(request.data.results);
			console.table(request.data.results);
			return request;
		}
		fetchData();
	}, [props.fetchUrl]);

	let moviesList = null;
	moviesList = movies.map((movie) => {
		if (
			(props.isLargeRow && movie.poster_path) ||
			(!props.isLargeRow && movie.backdrop_path)
		) {
			return (
				<img
					key={movie.id}
					onClick={() => handleClick(movie)}
					className={`row_poster ${props.isLargeRow && "row_posterLarge"}`}
					src={`${baseUrl}${
						props.isLargeRow ? movie.poster_path : movie.backdrop_path
					}`}
					alt={movie.name}
				/>
			);
		}
	});

	const opts = {
		height: "390",
		width: "100%",
		playerVars: {
			autoplay: 1,
		},
	};

	const handleClick = (movie) => {
		if (trailerUrl) {
			setTrailerUrl("");
		} else {
			movieTrailer(movie?.name || "")
				.then((url) => {
					const urlParams = new URLSearchParams(new URL(url).search);
					setTrailerUrl(urlParams.get("v"));
				})
				.catch((error) => console.log(error));
		}
	};

	return (
		<div className="row">
			<h2 className="movieTitle">{props.title}</h2>
			<div className="row_posters">{moviesList}</div>
			{trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
		</div>
	);
}

export default Row;
