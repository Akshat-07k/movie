from flask import Flask, jsonify, request
import pickle
import pandas as pd

app = Flask(__name__)

# Load similarity matrix and movie data
# with open('similarity_matrix.pkl', 'rb') as f:
#     similarity = pickle.load(f)
similarity = pickle.load(open('similarity_matrix.pkl', 'rb'))

# new_df = pd.read_csv('tmdb_5000_movies.csv') 
movie_dict = pickle.load(open('movie_dict.pkl','rb'))
movies = pd.DataFrame(movie_dict)

def recommend(movie):
    movie_index = movies[movies['title'] == movie].index[0]
    distance = similarity[movie_index]
    movies_list = sorted(list(enumerate(distance)), reverse=True, key = lambda x: x[1])[1:6]
    
    recommended_movie = []
    for i in movies_list:
        recommended_movie.append((int(movies.iloc[i[0]].movie_id), movies.iloc[i[0]].title))
    return recommended_movie
# def recommend(movie):
#     movie_index = new_df[new_df['title'] == movie].index[0]
#     distance = similarity[movie_index]
#     movie_list = sorted(list(enumerate(distance)), reverse=True, key=lambda x: x[1])[1:6]
#     recommendations = [new_df.iloc[i[0]].title for i in movie_list]
    
#     return recommendations
# print(recommend('Avatar'))

@app.route('/recommend', methods=['POST'])
def recommend_movies():
    data = request.json
    movie = data.get('movie')
    if not movie:
        return jsonify({'error': 'No movie title provided'}), 400
    
    try:
        recommendations = recommend(movie)
        return jsonify({'recommendations': recommendations})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
