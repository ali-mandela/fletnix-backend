const express = require('express'); 
const { verifyToken } = require('../config/util'); 
const { searchMovies, getMovieController } = require('../controllers/moviesController');
const router = express.Router();

router.get("/search",verifyToken, searchMovies);
router.get("/:id",verifyToken, getMovieController);

module.exports = router
