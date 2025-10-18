# Firebase Cloud Function: Gemini Sentence Generator

This folder contains a Firebase Cloud Function to generate sentences using the Gemini API, with the API key securely stored in a `.env` file (or as a deployed environment variable).

## Setup

1. **Add your Gemini API key to `.env`:**
   ```bash
   cd functions
   echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Deploy the function:**
   ```bash
   firebase deploy --only functions:generateSentence
   ```

## Usage

Send a POST request to the deployed function endpoint with JSON body `{ "word": "example" }`.

## Notes
- The function reads the Gemini API key from `.env` or environment variables.
- Add your frontend domain to Firebase Authentication > Authorized domains for OAuth.
- For production, validate Firebase ID tokens in the function for authenticated access.
