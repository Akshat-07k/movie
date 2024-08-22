let id = -1;
let nam = "";
let index = -1;
let movieID = [];
const showSuggestion = function (movieTitles) {

    const inputField = document.querySelector('.input');
    const sugg = document.querySelector('.suggestion');
    const butt = document.querySelector('.submit');
    const cont = document.querySelector('.container');
    inputField.addEventListener('input', () => {
        if (movieTitles.length > 0) {
            const query = inputField.value.toLowerCase();
            sugg.innerHTML = '';

            if (query.length > 0) {
                let temp = 0;
                // const filteredTitles = movieTitles.filter(item => item.title?.toLowerCase().includes(query)).slice(0, 5);
                const filteredTitles = movieTitles
                    .map((item, index) => ({ ...item, index }))  // Map the array to include the index
                    .filter(item => item.title?.toLowerCase().includes(query))  // Filter the items by title
                    .slice(0, 5);
                // an array 

                filteredTitles.forEach(item => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.textContent = item.title;
                    suggestionItem.addEventListener('click', () => {
                        inputField.value = item.title;
                        id = item.id;
                        nam = item.title;
                        sugg.innerHTML = ''; // Clear suggestions after selection
                        index = item.index;
                    });
                    sugg.appendChild(suggestionItem);
                })

                if (filteredTitles.length === 0) {
                    const noResult = document.createElement('div');
                    noResult.textContent = 'No suggestions';
                    sugg.appendChild(noResult);
                }
            }
        }
        else return;
    })
    butt.addEventListener('click', () => {
        fetch('./similarity_matrix.json').then(res => res.json())
            .then(res => {
                if (index != -1) {
                    const similarityScores = res[index];
                    const scoresWithIndex = similarityScores
                        .map((score, index) => ({ score, index }))  // Pair each score with its original index
                        .sort((a, b) => b.score - a.score).slice(1, 7);
                    cont.innerHTML = ''
                    scoresWithIndex.forEach((score, index) => {
                        // console.log(movieID[score.index]);
                        fetch(`https://api.themoviedb.org/3/movie/${movieID[score.index]}`, {
                            method: 'GET',
                            headers: {
                                accept: 'application/json',
                                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NGUyNjNkOTMwN2E5YzVkODQ4NmI0YzM1ZWU1ZmUzMCIsIm5iZiI6MTcyNDIzNTQ1Mi43OTQ3MjksInN1YiI6IjY2YzViOWE2NmQxMDliMzNjMGFkZWI4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9XAcWGg5XlpCjD_-yax5LHiUj5cKfjCMW0gX_4g-BKw'
                            }
                        }).then(res => res.json()).then(res => {
                            console.log(res);
                            const temp = document.createElement('div');
                            temp.innerHTML = `
                                <h1>${res.title}</h1>
                                <br/>
                                <img src="https://image.tmdb.org/t/p/w500/${res.poster_path}" style="max-width: 95%; height: auto; object-fit: cover;"/>
                                <p class="overview">${res.overview}</p>
                            `
                            temp.classList.add('card');
                            cont.appendChild(temp)
                        })

                    })


                }
            })
    })

};

let movieTitles = [];
function fetchMovieData() {
    return fetch('movie_dict.json')
        .then(response => response.json())
        .then(data => {

            const size = 4808;
            movieTitles = new Array(size);
            for (let i = 0; i < 4808; i++) {
                const id = data.movie_id[i];
                const title = data.title[i];
                movieTitles[i] = { id, title };
            }
            movieID = data.movie_id;
            showSuggestion(movieTitles)
        })
        .catch(error => {
            console.error('Error loading the JSON file:', error);
        });
}
fetchMovieData();