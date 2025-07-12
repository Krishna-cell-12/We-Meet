# We Meet

We Meet is a modern web application designed to help people connect, build meaningful relationships, and discover new friends or potential partners. The platform offers a safe, user-friendly, and feature-rich environment for online dating and social networking.

## Features

- **Smart Matching:** Advanced algorithms connect users based on shared interests, values, and relationship goals.
- **Personalized Profiles:** Users can create detailed profiles, upload photos, and select interests.
- **Real-Time Messaging:** Secure, instant messaging between users, with chat history stored locally.
- **Social Login:** Sign up or log in using email/password, Google, or Facebook accounts (via Firebase Authentication).
- **Profile Discovery:** Browse and filter profiles by interests, age, and location.
- **Mobile-First Design:** Responsive UI for seamless experience on desktop and mobile devices.
- **Safety & Privacy:** End-to-end encrypted messaging, privacy controls, and safety tips.
- **Notifications:** Real-time notifications for new messages and matches.

## Screenshots

> _Add screenshots of the main pages (Home, Profile, Chat, etc.) here._

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (for local development server, optional)
- A modern web browser
- [Firebase](https://firebase.google.com/) project (for authentication, Firestore, and storage)

### Setup
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd "We Meet"
   ```
2. **Firebase Configuration:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Authentication (Email/Password, Google, Facebook).
   - Enable Firestore Database and Storage.
   - Replace the `firebaseConfig` object in `js/login.js` and `js/profile.js` with your own Firebase project credentials.

3. **Run Locally:**
   - You can open `index.html` directly in your browser, or use a local server:
     ```bash
     npx serve .
     # or
     python -m http.server
     ```

## Project Structure

```
We Meet/
  ├── index.html         # Landing page
  ├── home.html          # Profile discovery and browsing
  ├── login.html         # Login and signup
  ├── profile.html       # User profile management
  ├── chats.html         # Chat interface
  ├── about.html         # About and mission
  ├── safety.html        # Safety guidelines
  ├── css/               # Stylesheets
  └── js/                # JavaScript files (core logic)
```

## Usage

- **Sign Up / Login:** Create an account using email/password, Google, or Facebook.
- **Create Profile:** Fill out your profile, upload a photo, and select your interests.
- **Discover Profiles:** Browse other users, filter by interests, and start a chat.
- **Chat:** Send and receive messages in real time. Chats are private and secure.
- **Edit Profile:** Update your information and interests anytime from the profile page.

## Safety & Privacy

- All user data is protected with advanced encryption and strict access controls.
- End-to-end encrypted messaging ensures your conversations remain private.
- Follow in-app safety tips:
  - Keep personal information private.
  - Be cautious with links and files from unknown users.
  - Report suspicious activity to support.
- Users must be at least 18 years old.

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements, bug fixes, or new features.

## License

> _Specify your license here (e.g., MIT, Apache 2.0, etc.)_

---

**We Meet** – Connecting hearts, building relationships, and creating lasting memories. 
