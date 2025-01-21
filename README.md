# Note-Taking App

## Description

This is a note-taking app with registration, authorization, adding, editing, deleting notes, and the ability to attach images. The app has a Node.js/Express backend and a React.js frontend. Data is stored in MongoDB.

---

## Functional

- User registration and authorization
- Creating, editing and deleting notes
- Ability to upload images for notes
- Filtering notes by categories
- Convenient user interface
- JWT authentication to protect routes

---

## Technologies

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Multer to upload files

### Frontend
- React.js
- Material-UI for styling
- Axios for HTTP requests

### Testing
- Jest
- Supertest
- React Testing Library

### Infrastructure
- Docker and Docker Compose
- Nginx for distribution frontend
- MongoDB

---

## Installation and Launch

### Requirements:
- Node.js versions 18+
- Docker and Docker Compose
- MongoDB

### Installation with Docker:
1. Clone the repository:
   ```bash
   git clone 
   cd note-taking-app


2. **Launch containers:**

    ```bash
    docker-compose up --build
    ```

3. **The application will be available:**
   - Backend: [http://localhost:5001](http://localhost:5001)
   - Frontend: [http://localhost:3002](http://localhost:3002)

---
##  Testing

Tests for **backend** and **frontend** are run **locally**. Make sure you have **Node.js** installed and MongoDB running locally or via Docker.

---

###  Preparing the environment for testing

1. Install dependencies for the backend:
   ```bash
   cd backend
   npm install
 ```

2. Install dependencies for frontend:
```bash
cd frontend
npm install
 ```

3. Start MongoDB locally:
 ```bash
   mongod
  ```

Or via Docker:
```bash
docker run --name mongo -d -p 27017:27017 mongo:6.0
```
4. Running tests
```bash
cd frontend
npm install
```

1. Backend:
```bash
cd backend
npm test
```
2. Frontend:
```bash
cd frontend
npm test
```

## Notes:
Make sure the environment variables in the .env file are set correctly for the test environment.
MongoDB should be available on port 27017 (locally or in Docker).

## Install locally:


1. **Install dependencies for backend:**

    ```bash
    cd backend
    npm install
    ```

2. **Install dependencies for frontend:**

    ```bash
    cd frontend
    npm install
    ```

3. **Run the backend:**

    ```bash
    cd backend
    npm start
    ```

4. **Launch frontend:**

    ```bash
    cd frontend
    npm start
    ```


