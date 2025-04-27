# LawLexicon

A React-powered legal dictionary application designed to make legal terminology accessible and engaging through interactive learning experiences.

## 🔍 Features

- **Comprehensive Legal Dictionary**: Browse and search legal terms with detailed definitions and Indian case references
- **Law Notes Section**: Access organized law notes by semester and subject
- **Word of the Day**: Highlighted legal term that changes daily
- **Interactive Examples**: Both Indian and American legal context examples for better understanding
- **User Contributions**: Submit new terms to expand the knowledge base
- **Admin Panel**: Moderate content and track visitor statistics
- **Mobile Responsive**: Optimized for all device sizes

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **State Management**: React Query, Context API
- **Routing**: Wouter
- **Forms**: React Hook Form, Zod Validation
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Firebase Auth

## 📋 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Firebase project

### Environment Variables

Create a `.env` file with:

```
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/lawlexicon

# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/lawlexicon.git
   cd lawlexicon
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up database
   ```bash
   npm run db:push
   ```

4. Start development server
   ```bash
   npm run dev
   ```

## 🚀 Deployment

This project is configured for Firebase Hosting deployment:

1. Make sure all Firebase secrets are added to GitHub repository secrets
2. Push to the main branch to trigger automatic deployment
3. Or deploy manually using Firebase CLI:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## 💖 Created with love from Latur