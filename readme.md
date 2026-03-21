# 🚗 Vehicle Rental System

This is a vehicle rental system built with Node.js, Express, and PostgreSQL. It allows users to manage vehicles, customers, and bookings. The system includes features for creating, reading, updating, and deleting vehicles, customers, and bookings. It also includes authentication and authorization for secure access to the API endpoints.

## Features
- User authentication and authorization
- CRUD operations for vehicles, customers, and bookings
- CRUD operations for users (admin only)
- Booking management with conflict handling
- Role-based access control (admin and customers)
- Conflict handling for vehicle deletion when active bookings exist
- Comprehensive error handling and validation

## Technologies Used
- Node.js
- Express
- PostgreSQL
- TypeScript
- JWT for authentication
- Bcrypt for password hashing
- Dotenv for environment variable management

## API Endpoints

**Live URL : https://vehicle-rental-system-livid.vercel.app**

### Authentication
| Method | Endpoint | Access | Description                |
|--------|----------|--------|----------------------------|
| POST   | /api/v1/auth/signin | Public | Authenticate user and generate token |
| POST   | /api/v1/auth/signup | Public | Register a new user |

### Vehicles
| Method | Endpoint | Access | Description                |
|--------|----------|--------|----------------------------|
| POST   | /api/v1/vehicles | Admin only | Create a new vehicle       |
| GET    | /api/v1/vehicles | Public | Retrieve all vehicles      |
| GET    | /api/v1/vehicles/:vehicleId | Public | Retrieve a specific vehicle |
| PUT    | /api/v1/vehicles/:vehicleId | Admin only | Update a specific vehicle |
| DELETE | /api/v1/vehicles/:vehicleId | Admin only | Delete a specific vehicle |

### Users
| Method | Endpoint | Access | Description                |
|--------|----------|--------|----------------------------|
| GET    | /api/v1/users | Admin only | Retrieve all users     |
| PUT    | /api/v1/users/:userId | Admin or Own | Update a specific user |
| DELETE | /api/v1/users/:userId | Admin only | Delete a specific user |

### Bookings
| Method | Endpoint | Access | Description                |
|--------|----------|--------|----------------------------|
| POST   | /api/v1/bookings | Authenticated users | Create a new booking |
| GET    | /api/v1/bookings | Role-based | Retrieve all bookings      |
| PUT    | /api/v1/bookings/:bookingId | Role-based | Update a specific booking |

## Project Structure

- `src/`: Contains the source code for the application.
  - `config/`: Configuration files (e.g., database connection).
  - `middlewares/`: Express middleware functions.
  - `modules/`: Contains the main modules of the application (vehicles, customers, bookings).
    - `auth/`: Authentication module (controller, service, routes).
    - `vehicles/`: Vehicle management module (controller, service, routes).
    - `customers/`: Customer management module (controller, service, routes).
    - `bookings/`: Booking management module (controller, service, routes).
  - `types/`: TypeScript type definitions for the application.
  - `app.ts`: Main application entry point.
  - `server.ts`: Server setup and initialization.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/TonmoySarker-BD/Vehicle-Rental-System.git
```

2. Navigate to the project directory:

```bash
cd Vehicle-Rental-System
```

3. Install dependencies:

```bash
npm install
```

4. Set up the PostgreSQL database and update the connection details in

       `src/config/db.ts`.

5. Run the application:

```bash
npm run dev
```

## License
This project is licensed under the MIT License.