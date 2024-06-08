# authExample
A demonstration project for implementing an authentication flow using NestJS. The project utilizes **JWT tokens** for authentication, with both **Access** and **Refresh** tokens stored in **cookies**. It includes basic setup for user authentication and protected endpoints. 

The project has two branches:
- **Cookies-based**: Implements JWT tokens for authentication with **HTTPOnly cookies**.
- **Bearer-auth**: Implements JWT tokens for authentication using **Bearer tokens**.

# Features
- Authentication flow using JWT tokens
- Access and refresh tokens
- Two modes of token storage: HTTPOnly cookies and Bearer tokens
- Protected endpoints for authenticated users

# Dependencies
All project dependencies are listed in the `package.json` file. Make sure you have `pnpm` installed to manage the packages.

# Installation
To install the dependencies:
```bash
pnpm install
```

# Configuration
Before running the server, ensure you have a `.env` file in the root directory with the following variables: `PORT`, `ACCESS_SECRET`, `ACCESS_EXP`, `REFRESH_SECRET`, `REFRESH_EXP`, `DATABASE_URL`. Example of the file:

```env
PORT=3000
ACCESS_SECRET=your_access_secret
ACCESS_EXP=3600
REFRESH_SECRET=your_refresh_secret
REFRESH_EXP=86400
DATABASE_URL=your_database_url
```

# Usage
To start the API server, use one of the following commands:

## Development
```bash
pnpm start
```

## Watch Mode
```bash
pnpm start:dev
```

## Production Mode
```bash
pnpm start:prod
```

## End-to-End Testing
```bash
pnpm test:e2e
```

# Endpoints
## Authentication Endpoints
### 1. Sign Up
- Endpoint: POST /auth/signUp
- Description: Registers a new user and sets the access and refresh tokens in cookies.
- Request Body: SignUpDto

### 2. Sign In
- Endpoint: GET /auth/signIn
- Description: Authenticates a user and sets the access and refresh tokens in cookies.
- Request Body: SignInDto

### 3. Logout
- Endpoint: GET /auth/logout
- Description: Logs out a user and clears the access and refresh tokens from cookies.
- Guards: JwtAccesGuard

### 4. Refresh Token
- Endpoint: GET /auth/refresh
- Description: Refreshes the access token using the refresh token.
- Guards: JwtRefreshTokenGuard

## User Endpoints
### 1. Test User ID
- Endpoint: GET /user/testUserId
- Description: Returns the user ID.
- Guards: JwtAccesGuard

### 2. Get Profile
- Endpoint: GET /user/profile
- Description: Returns the user's profile information.
- Guards: JwtAccesGuard

### 3. Edit Profile
- Endpoint: PATCH /user/editProfile
- Description: Edits the user's profile information.
- Request Body: EditUserDto
- Guards: JwtAccesGuard

# License
This project is licensed under the MIT License.
