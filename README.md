"# fletnix-backend" 
# � Fletnix Backend

## 🚀 Quick Start

1. **Clone the repository**: 
   git clone https://github.com/ali-mandela/fletnix-backend.git


2. **Install dependencies:**:
    using the command ## npm install

3. **create an .env file in the root of the folder with the following data:**:
    PORT=8000, MONGO_URI=mongodb://your-mongo-uri-here, JWT_SECRET=your-jwt-secret-here


4. **use the command  to start the server locally:**:
    npm run server

## Endpoints details 

1. **POST /api/auth/signup  --> to register a user with name, email, password, age**
2. **POST /api/auth/signin , -->to login using email and password**
3. **GET/api/movies/search?query&type&page for --> searching the movie**
4. **GET /api/movies/:id --> getting the movie details**