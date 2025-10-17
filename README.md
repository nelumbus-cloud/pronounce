# PronouncD - Pronunciation Practice App

A modern web application to help users practice English pronunciation with interactive features and AI-powered sentence generation.

## Features

- 🔐 **Authentication**: Google and Facebook sign-in
- 📚 **Word Management**: Add, edit, and delete words with optional sentences
- 🤖 **AI Integration**: Auto-generate sentences using Google Gemini
- 🔊 **Text-to-Speech**: Multiple playback modes and speed controls
- 🎯 **Practice Modes**:
  - Word only
  - Full sentence
  - Loop mode (continuous repetition)
  - Word-by-word (with breaks)
  - Syllable breakdown
- ⚙️ **Customizable Settings**: Speed control, volume, and practice tips
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, React Router, Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **AI**: Google Gemini API
- **Text-to-Speech**: Web Speech API
- **Icons**: Lucide React

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd pronouncd
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Google and Facebook providers)
3. Create a Firestore database
4. Copy your Firebase config to a `.env` file:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 3. Gemini AI Setup

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to your `.env` file:

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the Application

```bash
npm start
```

The app will be available at `http://localhost:3000`

## Usage

### Getting Started

1. **Sign In**: Use Google or Facebook to authenticate
2. **Add Words**: Click "Add Word" to add new words for practice
3. **Auto-Generate Sentences**: Leave the sentence field empty to auto-generate with AI
4. **Practice**: Click "Practice" on any word to start pronunciation practice

### Practice Modes

- **Word Only**: Practice just the word
- **Sentence**: Practice the full sentence
- **Loop**: Continuous repetition with pauses
- **Word by Word**: Break down sentences word by word
- **Syllables**: Break down words by syllables

### Controls

- **Play/Pause**: Single click to play, click again to pause
- **Speed Control**: Adjust playback speed from 0.5x to 2x
- **Volume**: Mute/unmute functionality
- **Settings**: Access advanced settings and practice tips

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.js     # Main dashboard
│   ├── Login.js         # Authentication
│   ├── WordPractice.js  # Practice interface
│   └── ...
├── contexts/            # React contexts
│   ├── AuthContext.js   # Authentication state
│   └── WordContext.js   # Word management
├── services/            # External services
│   └── geminiService.js # AI integration
└── firebase/            # Firebase configuration
    └── config.js
```

## Future Enhancements

- 📱 Mobile app (React Native)
- 🎤 Speech recognition for pronunciation feedback
- 📊 Progress tracking and analytics
- 👥 Social features and sharing
- 🏆 Gamification and achievements
- 🌍 Multiple language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
