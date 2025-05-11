# 💜 BTS Birthday Surprise Website 💜

An interactive, animated React website celebrating birthdays with BTS-themed elements, focusing on JK and Jin.


## ✨ Features

- **Animated Intro Screen** - Dynamic welcome with floating BTS-themed elements
- **Interactive Journey Path** - Guided experience through the birthday celebration
- **Heartfelt Birthday Letter** - Beautifully presented personal message
- **BTS Music Room** - Spotify-powered music player featuring JK and Jin tracks
- **Responsive Design** - Looks great on all devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn
- Spotify Developer Account for API access

### Installation

1. Clone the repository:
   ```bash
   git clone "my repo link"
   cd bts-birthday-surprise
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   
3. Configure environment variables:
   ```
   VITE_SPOTIFY_CLIENT_ID=client_id
   VITE_SPOTIFY_CLIENT_SECRET=client_secret
   VITE_REDIRECT_URI=http://localhost:5173/callback
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application at `http://localhost:5173`

## 🎵 Spotify API Setup

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Create a new application
3. Add `http://localhost:5173/callback` as a redirect URI in the app settings
4. Configure the Client ID and Client Secret in the environment variables

## 🧩 Project Structure

```
BirthdayProject/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── assets/
│       ├── images/
│       │   ├── bts/
│       │   │   ├── group/
│       │   │   ├── jk/
│       │   │   ├── jin/
│       │   │   └── symbols/
│       │   └── backgrounds/
│       └── fonts/
├── src/
│   ├── App.js
│   ├── index.js
│   ├── styles/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── context/
├── package.json
├── .env
└── README.md
```

## 🛠️ Built With

- [React](https://reactjs.org/) - UI library
- [React Router](https://reactrouter.com/) - Navigation
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Styled Components](https://styled-components.com/) - CSS-in-JS styling
- [Axios](https://axios-http.com/) - API requests
- [React Spring](https://react-spring.io/) - Physics-based animations
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) - Music integration

## 🎨 Customization Options

### Personal Touches

- BTS images in the `public/assets/images/` directory
- Birthday letter text in `src/components/LetterPage.js`
- BTS song playlist in `src/utils/constants.js`
- Color scheme in `src/context/ThemeContext.js`

### Feature Extensions

- Photo gallery with BTS memories
- Birthday countdown timer
- Additional BTS-themed interactive elements
- Sections for other BTS members

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

### Netlify Deployment

1. Create a production build:
   ```bash
   npm run build
   ```

2. Deploy using the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy
   ```

### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

## ⚠️ Troubleshooting

### Spotify API Issues
- Verify API credentials
- Confirm redirect URIs match exactly
- Check that the Spotify Developer account is active

### Image Loading Problems
- Verify image paths
- Use relative paths when necessary
- Confirm supported image formats (JPG, PNG, SVG)

### Animation Performance
- Optimize number of animated elements for performance
- Compress images for faster loading
- Use Chrome DevTools to diagnose performance issues

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💜 Acknowledgements

- BTS for the inspiration
- ARMY community for resources
- [HYBE](https://hybecorp.com) (formerly BigHit Entertainment) for creating BTS
- All the libraries and tools that made this project possible

---

Made with 💜 for BTS fans