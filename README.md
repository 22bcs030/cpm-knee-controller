# CPM Knee Controller

A modern web application for controlling and monitoring Continuous Passive Motion (CPM) therapy devices for knee rehabilitation.

## Overview

The CPM Knee Controller provides a comprehensive user interface for healthcare professionals and patients to:
- Control CPM device parameters
- Monitor motion data in real-time
- Manage therapy sessions
- Export session data in various formats
- Customize therapy protocols

## Hardware Setup

To set up the CPM machine hardware:

1. **Upload Code**:
   - First, upload the ESP8266 WiFi module code to your ESP8266
     - Set the baud rate to 115200 in the Arduino IDE
     - Select the correct board type (ESP8266)
   - Then, upload the Arduino Mega code to your Arduino Mega
     - Set the baud rate to 115200 in the Arduino IDE
     - Select the correct board type (Arduino Mega 2560)
   - Make sure to update the WiFi credentials (SSID and password) in the ESP8266 code to match your network

2. **Power Supply**:
   - Connect the ESP8266 to a 3.3V power supply
   - Connect the Arduino Mega to a 5V power supply

3. **Network Connection**:
   - Ensure both the WiFi module and your computer/device are connected to the same WiFi network
   - Note down the IP address displayed by the ESP8266 module

4. **Application Connection**:
   - Open the web application
   - Click the "Connect" button
   - Enter the ESP8266's IP address
   - Click "Connect" to establish communication with the CPM machine
   - Once connected, you can use the application interface to control the CPM machine

## Screenshots

### Control Interface
![Control Interface](/images/Screenshot%202025-04-18%20012522.png)
![Dark mode](/images/Screenshot%202025-04-18%20012808.png)

### Live Data Monitoring
![Live Data Monitoring](/images/Screenshot%202025-04-18%20012723.png)

### Session Management
![Session Management](/images/Screenshot%202025-04-18%20012748.png)

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

## Features

- **Real-time Motion Control**: Adjust speed, angle, and therapy parameters
- **Data Visualization**: View live motion graphs and real-time feedback
- **Session Management**: Track and store therapy sessions
- **Data Export**: Export session data in multiple formats (JSON, CSV, Excel, PDF)
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Theme**: User-selectable interface theme

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

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
