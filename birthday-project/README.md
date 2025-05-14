💜 BTS Birthday Surprise Website 💜
An interactive, animated React website celebrating birthdays with BTS-themed elements, focusing on JK and Jin.
✨ Features

Animated Intro Screen - Dynamic welcome with floating BTS-themed elements
Interactive Journey Path - Guided experience through the birthday celebration
Heartfelt Birthday Letter - Beautifully presented personal message
BTS Music Room - Custom music player featuring JK and Jin tracks
Responsive Design - Looks great on all devices

🚀 Getting Started
Prerequisites

Node.js (v14.0.0 or higher)
npm or yarn

Installation

Clone the repository:
git clone "my repo link"
cd bts-birthday-surprise


Install dependencies:
npm install


Start the development server:
npm run dev


Access the application at http://localhost:5173


🧩 Project Structure
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
│       └── audio/
│           ├── tracks/
│           └── covers/
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

🛠️ Built With

React - UI library
React Router - Navigation
Framer Motion - Animations
Styled Components - CSS-in-JS styling
Axios - API requests
React Spring - Physics-based animations

🎨 Customization Options
Personal Touches

BTS images in the public/assets/images/ directory
Audio tracks and cover art in public/assets/audio/
Birthday letter text in src/components/LetterPage.js
BTS song playlist in src/utils/constants.js
Color scheme in src/context/ThemeContext.js

Feature Extensions

Photo gallery with BTS memories
Birthday countdown timer
Additional BTS-themed interactive elements
Sections for other BTS members

📱 Responsive Design
The website is fully responsive and works on:

Desktop computers
Tablets
Mobile phones

🚀 Deployment
Netlify Deployment

Create a production build:
npm run build


Deploy using the Netlify CLI:
npm install -g netlify-cli
netlify deploy



Vercel Deployment

Install Vercel CLI:
npm install -g vercel


Deploy:
vercel



⚠️ Troubleshooting
Audio Loading Issues

Verify audio file paths in public/assets/audio/
Ensure supported audio formats (MP3, WAV)
Check file permissions and CORS settings for deployed apps

Image Loading Problems

Verify image paths
Use relative paths when necessary
Confirm supported image formats (JPG, PNG, SVG)

Animation Performance

Optimize number of animated elements for performance
Compress images and audio files for faster loading
Use Chrome DevTools to diagnose performance issues

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
💜 Acknowledgements

BTS for the inspiration
ARMY community for resources
HYBE (formerly BigHit Entertainment) for creating BTS
All the libraries and tools that made this project possible


Made with 💜 for BTS fans
