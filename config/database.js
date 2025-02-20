const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Movies = require('../models/movieModel');

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
  try { 
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB connected successfully to: ${conn.connection.name}`);

    // Open CSV file and parse data
    const results = [];
    const filePath='./data/netflix_titles.csv';
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        try { 
          const moviesCount = await Movies.countDocuments();

          // If no movies exist, insert new data
          if (moviesCount === 0) {
            await Movies.insertMany(results);
            console.log('CSV data uploaded successfully!');
          } else {
            console.log('Movies already exist in the database, no data inserted.');
          } 
          mongoose.connection.close();
        } catch (error) {
          console.error('Error processing CSV data or inserting into DB:', error);
          mongoose.connection.close();
        }
      });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
