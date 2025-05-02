A.Features
Frontend:
Built with React using Vite for fast development and TypeScript for type safety.
Styled with Tailwind CSS for utility-first CSS.
Tested with Jest for unit and integration tests.
Linted with ESLint for code quality.

Backend:
Node.js and Express.js for server-side logic.
Mongoose for MongoDB object modeling.
MongoDB as the database.

Security:
Helmet for securing HTTP headers.
CORS for handling cross-origin requests.
Winston for logging.


B.Installation:

1.Clone the repository:
  git clone https://github.com/yourusername/your-repo.git


2.Navigate to the project directory and install dependencies:
  Frontend - cd client
  npm install

  Backend - cd server
  npm install


C.Usage

1.Running the Frontend
  Frontend - cd client
  Start the development server: npm run dev

2.Running the Backend
  Frontend - cd server
  Run the  server:npm run server


D.Testing

Run Jest tests: npm run test

E.Environment Variables
The backend requires the following environment variables. Create a .env file in the backend directory and add these variables:
PORT=5000  (mention the same port in Api.tsx in client (axios configuration) )
MONGODB_URI=mongodb://localhost:27017/mealapi_management (Mention the DB name here)
ACCESS_TOKEN_SECRET=add your token secret key
REFRESH_TOKEN_SECRET=add your refresh token secret key
NODE_ENV=DEVELOPMENT


