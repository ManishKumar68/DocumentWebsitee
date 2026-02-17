 Documentation Hub

A premium, modern, and responsive documentation portal built with **React**, **Vite**, and **Tailwind CSS**. This hub allows teams to create, organize, and manage complex documentation with ease, featuring a beautiful UI, dark mode support, and offline capabilities.

Documentation Hub Preview](./public/vite.svg) (*Replace with actual screenshot if available*)

## 🚀 Key Features

- **📘 Dynamic Documentation**: Browse and manage technical guides, API references, and architecture docs.
- **🌗 Dark/Light Mode**: Fully supported theme toggle with persistence (remembers your preference).
- **📱 Responsive Design**: optimized for Mobile, Tablet, and Desktop (with collapsible sidebar).
- **📝 Smart Editor**: Built-in markdown editor for creating new content.
- **📌 Small Notes**: Attach quick, sticky-note style insights to any document (max 50 words).
- **💾 Export to Markdown**: Download any guide as a production-ready `.md` file.
- **📦 Bulk Export**: Download the entire documentation set as a ZIP archive.
- **⚡ High Performance**: Built on Vite for instant loading and hot module replacement (HMR).

## 🛠️ Technology Stack

- **Frontend**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Utils**: JSZip (for bulk export)

## ⚙️ Installation & Setup

Follow these steps to get the project running on your local machine.

### 1. Prerequisites

Ensure you have **Node.js** (v18 or higher) installed.
Check your version:
```bash
node -v
```

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/saas-documentation-hub.git
cd saas-documentation-hub
```

### 3. Install Dependencies

Install all required packages using npm:
```bash
npm install
```

### 4. Run Development Server

Start the local development server:
```bash
npm run dev
```
> The app will typically run at **http://localhost:5173**

## 📦 Building for Production

To create an optimized build for deployment:

1. **Build the project**:
   ```bash
   npm run build
   ```
   This will generate a `dist` folder containing the production-ready assets.

2. **Preview the build** (optional):
   ```bash
   npm run preview
   ```

## 📂 Project Structure

```bash
saas-documentation-hub/
├── public/              # Static assets
├── src/
│   ├── App.jsx          # Main application logic & layout
│   ├── main.jsx         # Entry point
│   ├── index.css        # Global styles & Tailwind directives
│   └── ...
├── index.html           # HTML template
├── tailwind.config.js   # Tailwind CSS configuration
├── vite.config.js       # Vite configuration
└── package.json         # Project dependencies & scripts
```

## 🎨 Configuration

### Tailwind CSS
The project uses a standard `tailwind.config.js` setup. Dark mode is configured to use the `class` strategy, allowing manual toggling via the UI.

### Port Configuration
The dev server runs on port `5173` by default. You can change this in `vite.config.js` or by setting the `PORT` environment variable.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed by Manish Kumar**

# DocumentWebsitee

# DocumentWebsitee
