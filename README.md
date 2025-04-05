# Smart Mirror Assistant

An AI-powered smart mirror interface with face recognition, voice commands, and personalized information.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Setup and Configuration](#setup-and-configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Component Details](#component-details)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## 🔭 Overview

Smart Mirror Assistant is a modern web application that simulates an intelligent mirror interface. It combines AI capabilities with a sleek UI to provide users with personalized information, face recognition, voice commands, and more. The application is designed to be displayed on a mirror with a screen behind it, creating a futuristic smart home experience.

## ✨ Features

- **User Authentication**: Login/signup with email or Google
- **Face Recognition**: Identify users through facial recognition
- **Voice Assistant**: Control the interface with voice commands
- **AI-Powered Chat**: Interact with Gemini AI for intelligent responses
- **Task Planning**: Generate AI-optimized daily schedules
- **Weather Information**: Display current weather and forecasts
- **Smart Home Controls**: Simulate control of home devices
- **Health Metrics**: Track and visualize health data
- **Video Chat**: Connect with others through video calls
- **News Headlines**: Stay updated with the latest news
- **Personalized Insights**: AI-generated insights based on user data
- **Theme Toggling**: Switch between light and dark modes

## 🛠️ Technologies Used

- **Frontend Framework**: Next.js (App Router)
- **UI Library**: React
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: Custom implementation (simulated)
- **Face Recognition**: face-api.js
- **Voice Recognition**: Web Speech API
- **AI Integration**: Google Gemini API
- **Charts**: Chart.js
- **Animations**: Framer Motion
- **Icons**: Font Awesome
- **Background Effects**: Particles.js

## 📥 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/smart-mirror-assistant.git
   cd smart-mirror-assistant
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**: Create a `.env.local` file in the root directory with the following content:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```
   Replace `your_gemini_api_key` with your actual Google Gemini API key.

4. **Download face-api.js models**:
   - Create a `public/models` directory
   - Download the required model files from face-api.js GitHub repository
   - Place the following files in the `public/models` directory:
     - ssd_mobilenetv1_model-weights_manifest.json
     - ssd_mobilenetv1_model-shard1
     - face_landmark_68_model-weights_manifest.json
     - face_landmark_68_model-shard1
     - face_recognition_model-weights_manifest.json
     - face_recognition_model-shard1
     - face_recognition_model-shard2

## ⚙️ Setup and Configuration

### Google Gemini API Setup
1. Go to the Google AI Studio
2. Create a new API key
3. Copy the API key to your `.env.local` file

### Face Recognition Setup
The application uses face-api.js for face recognition. The models are loaded from the `public/models` directory. Make sure you've downloaded the required model files as mentioned in the installation section.

## 🚀 Usage

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Access the application**: Open your browser and navigate to http://localhost:3000

3. **Login or Sign Up**:
   - Use the authentication form to create an account or log in
   - You can use any email/password combination (it's simulated)
   - Alternatively, click "Continue with Google" for a simulated Google login

4. **Face Recognition**:
   - After logging in, click the camera icon to activate face recognition
   - Add your face by clicking "Add New Face" and entering your name
   - The system will remember your face for future logins

5. **Voice Commands**:
   - Click the microphone button to activate the voice assistant
   - Try commands like "What's the weather?", "What time is it?", or "Tell me the news"

6. **Task Planning**:
   - Add tasks in the Daily Planner section
   - Click "Generate Schedule" to create an AI-optimized daily schedule

7. **Chat Interface**:
   - Type messages in the chat input to interact with the AI assistant
   - Ask questions or request information

## 📁 Project Structure

```
smart-mirror-assistant/
├── app/                      # Next.js App Router
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout component
│   └── page.tsx              # Home page component
├── components/               # React components
│   ├── auth/                 # Authentication components
│   ├── main/                 # Main application components
│   └── ui/                   # UI utility components
├── context/                  # React Context providers
│   ├── UserContext.tsx       # User authentication context
│   └── VoiceContext.tsx      # Voice assistant context
├── config/                   # Configuration files
│   └── api-config.tsx        # API configuration
├── public/                   # Static assets
│   └── models/               # Face-api.js model files
├── .env.local                # Environment variables
├── package.json              # Project dependencies
└── tailwind.config.ts        # Tailwind CSS configuration
```

## 🧩 Component Details

### Authentication Components
- **AuthContainer**: Main container for authentication forms
- **LoginForm**: Email and password login form
- **SignupForm**: Registration form for new users

### Main Application Components
- **MainApp**: Container for all main application components
- **Header**: App header with user profile and controls
- **GreetingCard**: Displays personalized greeting and time
- **WeatherCard**: Shows current weather and forecast
- **VoiceAssistant**: Interface for voice commands
- **ChatInterface**: Text-based AI assistant
- **TaskPlanner**: AI-powered daily schedule generator
- **VideoChat**: Video calling interface
- **SmartHomeControls**: Simulated smart home device controls
- **HealthMetrics**: Health data visualization

### Context Providers
- **UserProvider**: Manages user authentication state
- **VoiceProvider**: Handles voice recognition and text-to-speech

## 🔌 API Integration

### Google Gemini API
The application uses Google's Gemini API for AI-powered features:
- **Chat responses**: Generate intelligent responses to user queries
- **Task scheduling**: Create optimized daily schedules based on tasks
- **Insights**: Generate personalized insights based on user data

The API is configured in `config/api-config.tsx` and used throughout the application.

### Face Recognition
Face recognition is implemented using face-api.js:
- **Face detection**: Identify faces in webcam feed
- **Face recognition**: Match detected faces with stored user faces
- **Face storage**: Save face descriptors for future recognition

### Web Speech API
The application uses the browser's Web Speech API for:
- **Speech recognition**: Convert spoken commands to text
- **Text-to-speech**: Read responses aloud to the user

## Task Planner Feature
The Task Planner component allows users to:
- Add tasks to a list
- Remove tasks from the list
- Generate an AI-optimized daily schedule using Google's Gemini API
- View the schedule with time slots, priorities, and notes for each task

The schedule generation considers:
- The current time and date
- Task complexity and priority
- Appropriate breaks between tasks
- Tips and context for each task

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please make sure to update tests as appropriate and follow the code style of the project.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
