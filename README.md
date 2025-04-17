# CPM Knee Controller

A modern web application for controlling and monitoring Continuous Passive Motion (CPM) therapy devices for knee rehabilitation.

## Overview

The CPM Knee Controller provides a comprehensive user interface for healthcare professionals and patients to:
- Control CPM device parameters
- Monitor motion data in real-time
- Manage therapy sessions
- Export session data in various formats
- Customize therapy protocols

## Screenshots

(Add screenshots of your application here)

## Technologies Used

- **Framework**: [Next.js 15](https://nextjs.org/)
- **UI Libraries**: 
  - [React 18](https://reactjs.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Radix UI](https://www.radix-ui.com/) for accessible components
  - [Framer Motion](https://www.framer.com/motion/) for animations
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Data Export**: 
  - [jsPDF](https://github.com/parallax/jsPDF) (PDF export)
  - [SheetJS](https://sheetjs.com/) (Excel export)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)

## Features

- **Real-time Motion Control**: Adjust speed, angle, and therapy parameters
- **Data Visualization**: View live motion graphs and real-time feedback
- **Session Management**: Track and store therapy sessions
- **Data Export**: Export session data in multiple formats (JSON, CSV, Excel, PDF)
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Theme**: User-selectable interface theme

## Installation

### Prerequisites

- Node.js 18.17 or later
- npm (Node Package Manager)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cpm-knee-controller.git
   cd cpm-knee-controller
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Required Dependencies

The following dependencies are required to run this project:

### Core Dependencies
```
"dependencies": {
  "@radix-ui/react-alert-dialog": "^1.1.7",
  "@radix-ui/react-slider": "^1.2.4",
  "@radix-ui/react-slot": "^1.2.0",
  "@radix-ui/react-tabs": "^1.1.4",
  "@radix-ui/react-toast": "^1.2.7",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "framer-motion": "^10.16.4",
  "jspdf": "^2.5.1",
  "jspdf-autotable": "^3.7.0",
  "lucide-react": "^0.292.0",
  "next": "^15.3.0",
  "next-themes": "^0.2.1",
  "react": "^18",
  "react-dom": "^18",
  "recharts": "^2.9.3",
  "tailwind-merge": "^3.2.0",
  "xlsx": "^0.18.5"
}
```

### Development Dependencies
```
"devDependencies": {
  "@types/node": "^20",
  "@types/react": "^18",
  "@types/react-dom": "^18",
  "autoprefixer": "^10.0.1",
  "eslint": "^8",
  "eslint-config-next": "14.0.3",
  "postcss": "^8",
  "tailwindcss": "^3.3.0",
  "tailwindcss-animate": "^1.0.7",
  "typescript": "^5"
}
```

## Usage

### Main Screens

1. **Controls Tab**:
   - Adjust therapy parameters
   - Start, stop, and pause sessions
   - Control device motion

2. **Live Data Tab**:
   - Monitor real-time motion data
   - View angle and position graphs

3. **Session Tab**:
   - Review session statistics
   - Export session data

## Building for Production

```bash
npm run build
npm run start
```

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
