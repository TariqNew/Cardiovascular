# Smart Dieting Recommendation System for Cardiovascular Patients

A web-based intelligent platform that provides personalized dietary recommendations and health monitoring for cardiovascular patients.

## Features

- User authentication and profile management
- Health profile creation and tracking
- AI-powered diet recommendations
- Automated health tips and insights
- Daily meal planning
- Health trends analysis
- Regular health monitoring

## Tech Stack

- Node.js with Express
- PostgreSQL with Prisma ORM
- OpenAI GPT-4 for intelligent recommendations
- JWT for authentication
- Express Validator for input validation

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- OpenAI API key

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/cardiovascular_db?schema=public"
JWT_SECRET="your-super-secret-key-here"
OPENAI_API_KEY="your-openai-api-key"
PORT=3000
```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update user profile

### Health Profile

- POST `/api/health/profile` - Create/Update health profile
- GET `/api/health/profile` - Get health profile
- POST `/api/health/logs` - Add health log
- GET `/api/health/logs` - Get health logs

### Recommendations

- GET `/api/recommendations/diet` - Get meal recommendations
- GET `/api/recommendations/analysis` - Get health analysis
- GET `/api/recommendations/tips` - Get health tips
- POST `/api/recommendations/schedule-meals` - Schedule daily meals

## Automated Features

- Health tips every 6 hours
- Daily meal planning at 5 AM
- Health trend analysis
- Personalized dietary recommendations

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- Protected routes
- Secure environment variables

## Error Handling

The API includes comprehensive error handling for:
- Invalid input
- Authentication errors
- Database errors
- OpenAI API errors
- General server errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License 