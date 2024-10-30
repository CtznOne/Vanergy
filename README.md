# Vanergy - Solar Panel Designer for Campervans

A professional web application for designing and planning solar panel installations on campervans.

## Features

- **Visual Designer**: Drag-and-drop interface for placing solar panels on your roof
- **Power Calculations**: Automatic calculations for power output and system requirements
- **MPPT Management**: Smart MPPT controller recommendations and assignments
- **Energy Planning**: Plan your energy consumption with common appliances
- **Inverter Selection**: Get recommendations for the right inverter based on your needs

## File Structure

### Pages
- `pages/Home.tsx`: Landing page with feature overview
- `pages/Login.tsx`: User login page
- `pages/Register.tsx`: New user registration page
- `pages/Designer.tsx`: Main design workspace with tabs for different functions

### Components

#### Design Tools
- `components/Grid.tsx`: Grid overlay for precise panel placement
- `components/Panel.tsx`: Individual solar panel component with drag functionality
- `components/PanelSelector.tsx`: Tool for selecting and adding new panels
- `components/ContextMenu.tsx`: Right-click menu for panel operations

#### Power Management
- `components/StringCreator.tsx`: Creates series/parallel connections between panels
- `components/StringCalculator.tsx`: Calculates power output for panel strings
- `components/MPPTManager.tsx`: Manages MPPT controller assignments
- `components/BatteryManager.tsx`: Energy consumption planning and calculations
- `components/InverterManager.tsx`: Inverter selection and compatibility checking

#### UI Components
- `components/Navbar.tsx`: Top navigation bar
- `components/PlacedComponents.tsx`: Shows list of all placed components

### Core Files
- `App.tsx`: Main application component and routing
- `store.ts`: Central data management
- `types.ts`: TypeScript type definitions
- `main.tsx`: Application entry point

## Getting Started

1. Sign up for an account
2. Enter your roof dimensions
3. Add solar panels to your design
4. Create panel strings
5. Assign MPPT controllers
6. Plan your energy consumption
7. Select an appropriate inverter

## MongoDB Setup

### 1. Install MongoDB
- Download and install MongoDB Community Server from the official website
- Or use MongoDB Atlas for a cloud-hosted solution

### 2. Create the Database
```bash
# Start MongoDB shell
mongosh

# Create and use the database
use vanergy

# Create collections
db.createCollection('users')
db.createCollection('panels')
db.createCollection('mppts')
db.createCollection('inverters')
```

### 3. Add Initial Data

```bash
# Add solar panels
db.panels.insertMany([
  {
    model: "BlueSolar 380W",
    watts: 380,
    volts: 37.1,
    amps: 10.24,
    width: 99.2,
    height: 198.4
  },
  {
    model: "BlueSolar 305W",
    watts: 305,
    volts: 32.5,
    amps: 9.38,
    width: 99.2,
    height: 164.5
  }
])

# Add MPPT controllers
db.mppts.insertMany([
  {
    model: "SmartSolar MPPT 100/20",
    maxVolts: 100,
    maxAmps: 20,
    maxWatts: 290
  },
  {
    model: "SmartSolar MPPT 150/35",
    maxVolts: 150,
    maxAmps: 35,
    maxWatts: 500
  },
  {
    model: "SmartSolar MPPT 250/100",
    maxVolts: 250,
    maxAmps: 100,
    maxWatts: 1450
  }
])

# Add inverters
db.inverters.insertMany([
  {
    model: "Phoenix 12/250",
    watts: 250,
    peakWatts: 400,
    efficiency: 87
  },
  {
    model: "Phoenix 12/500",
    watts: 500,
    peakWatts: 900,
    efficiency: 90
  },
  {
    model: "Phoenix 12/800",
    watts: 800,
    peakWatts: 1600,
    efficiency: 91
  },
  {
    model: "Phoenix 12/1200",
    watts: 1200,
    peakWatts: 2400,
    efficiency: 93
  },
  {
    model: "MultiPlus 12/1600",
    watts: 1600,
    peakWatts: 3000,
    efficiency: 93
  },
  {
    model: "MultiPlus 12/3000",
    watts: 3000,
    peakWatts: 6000,
    efficiency: 94
  }
])
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/vanergy
JWT_SECRET=your-secret-key
PORT=5000
```

For MongoDB Atlas, use the connection string provided in your Atlas dashboard:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/vanergy
```

### 5. Start the Application

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will now be connected to your MongoDB database and ready to use.

## Security Note
- Never commit the `.env` file to version control
- Change the JWT_SECRET to a secure random string in production
- Use proper authentication and authorization in production
- Configure MongoDB security settings and access controls

The app will guide you through creating an efficient and properly sized solar system for your campervan.