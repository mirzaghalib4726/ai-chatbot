# AI-Powered Chatbot

A Next.js chatbot application that uses Firebase for authentication and Google's Gemini API for generating responses.

## Features

- 🔐 Firebase Google Authentication
- 🤖 Gemini AI-powered responses
- 💡 Clickable suggestions for follow-up questions
- 🌓 Dark/Light mode support
- 📱 Responsive design
- ⌨️ Typing animation effects

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Firebase SDK
- Google Gemini API
- Tailwind CSS
- React Type Animation

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Firebase and Gemini API keys:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Add your environment variables in Netlify's dashboard
4. Deploy!

## Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase app ID
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID
- `GEMINI_API_KEY`: Your Google Gemini API key

## License

MIT