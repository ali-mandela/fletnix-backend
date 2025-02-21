import { test, expect, request } from '@playwright/test';

test.describe('Node.js API Tests', () => {
  let apiRequest;
  let authToken = '';
  let movieId = '';

  test.beforeAll(async ({ playwright }) => {
    apiRequest = await request.newContext({
      baseURL: 'http://localhost:8000',
      extraHTTPHeaders: {
        'Content-Type': 'application/json', // Ensure JSON format
      },
    });

    // 1️⃣ **Sign up and retrieve token**
    const signupResponse = await apiRequest.post('/api/auth/signup', {
      data: {
        name: "T user",
        age: 33,
        email: `testuser${Date.now()}@mail.com`,  // Unique email
        password: "123456"
      }
    });
 
    const responseText = await signupResponse.text();  
    expect(signupResponse.status()).toBe(201);
    const signupBody = JSON.parse(responseText);
    expect(signupBody).toHaveProperty('token');

    authToken = signupBody.token; 

    // 2️⃣ **Recreate API request context with the token**
    apiRequest = await request.newContext({
      baseURL: 'http://localhost:8000',
      extraHTTPHeaders: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
  });

  // 3️⃣ **Test searching for a movie and retrieve first movie ID**
  test('GET /movies/search - Search movies and retrieve first ID', async () => {
    const response = await apiRequest.get('/api/movies/search');
    expect(response.status()).toBe(200);

    const responseBody = await response.json(); 
    // Ensure movies exist
    expect(responseBody.data).toHaveProperty('movies'); 
     movieId = responseBody.data.movies[0]._id; 
  });

  // 4️⃣ **Test fetching a movie using its ID**
  test('GET /movies/:id - Fetch a single movie by ID', async () => {
    expect(movieId).not.toBe('');

    const response = await apiRequest.get(`/api/movies/${movieId}`);
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    const mId = responseBody.data; 
    expect(mId).toHaveProperty('_id', movieId);
  });
});
