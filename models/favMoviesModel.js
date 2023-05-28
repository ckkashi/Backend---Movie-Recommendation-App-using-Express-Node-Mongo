const mongoose = require('mongoose');

const favMoviesSchema = mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    movies_id:{
        type:[Number],
        required:true
    },
});

const favMoviesModel = mongoose.model('UsersFavMovies',favMoviesSchema);

module.exports = favMoviesModel;