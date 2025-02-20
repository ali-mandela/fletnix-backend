const Movies = require("../models/movieModel"); 
const UserModel = require("../models/userModel");


// function to find user age for searching
const findUserAge = async (id) => {
  if (!id) {
    throw new Error("User ID is required");
  }

  const user = await UserModel.findById(id);
  if (!user) {
    throw new Error("User not found");
  }

  return user.age;
};

// controller to search
module.exports.searchMovies = async (req, res) => {
  try {
    const { query, type, page = 1 } = req.query; 
    
    const id = req.user.id;
    const age = await findUserAge(id);

    const limit = 15;
    const skip = (page - 1) * limit;

    let filter = {};

    if (query) { 
      filter.$or = [
        { title: { $regex: query, $options: "i" } }, 
        { cast: { $regex: query, $options: "i" } },  
      ];
    }

    if (type) {
      filter.type = type;
    }

    if (age && parseInt(age) < 18) {
      filter.rating = { $ne: "R" };
    }
 
    const movies = await Movies.find(filter).skip(skip).limit(limit);
 
    const totalCount = await Movies.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Movies fetched successfully!",
      data: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalResults: totalCount,
        movies,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message || "Server error" });
  }
};

// controller to get movie details
module.exports.getMovieController = async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user.id; 
    const age = await findUserAge(userId); 

    const movie = await Movies.findById(id);  

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Restrict access for users under 18 if movie is rated "R"
    if (age && parseInt(age) < 18 && movie.rating === "R") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Age restriction in place",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Movie fetched successfully!",
      data: movie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message || "Server error" });
  }
};

