# Quran Audio Player (القرآن الكريم)

A beautiful, responsive web application to listen to and download the Holy Quran recited by Sheikh Mishary Rasyid Alafasy, organized by the 30 Juz.

## 🌟 Features

* **Complete Quran:** Access all 30 Juz of the Holy Quran in one place.
* **High-Quality Audio:** Features the beautiful and clear recitation by Sheikh Mishary Rasyid Alafasy.
* **Built-in Audio Player:** Custom audio player with play/pause, progress tracking, seeking, and volume controls.
* **Direct Downloads:** Download any Juz directly to your device as an MP3 file for offline listening. Includes a custom backend proxy to seamlessly handle redirects and CORS policies.
* **Modern UI:** Clean, distraction-free Arabic interface designed with Tailwind CSS and smooth animations using Framer Motion.
* **Responsive Design:** Works perfectly on desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

* **Frontend:** React 18, TypeScript, Vite
* **Styling:** Tailwind CSS
* **Icons & Animations:** Lucide React, Framer Motion
* **Backend (Proxy):** Node.js, Express (Used to resolve audio redirects and bypass CORS restrictions for downloads)

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/quran-audio-player.git
   cd quran-audio-player
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

### Building for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgements

* Audio files are hosted and provided by [Archive.org](https://archive.org/).
* Recitation by Sheikh Mishary Rasyid Alafasy.
