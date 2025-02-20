const mongoose = require('mongoose');
const { uploadCSVToMongoDB } = require('./util');

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
  try { 
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB connected successfully to: ${conn.connection.name}`); 
    await uploadCSVToMongoDB('./data/netflix_titles.csv');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);   
  }
};

module.exports = { connectDB };
