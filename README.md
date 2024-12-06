# Motion-Ship Online README

## Overview

This repository is an extension of the original Motion-Ship project.

- **Original Project**: Built solely with JavaScript and designed to run locally, providing a Player vs. Environment (PVE) web game.
- **Extension Features**:
  - Supports up to **2 players** in a local network for **Player vs. Player** (PVP) gameplay.
  - Also offers a **1v1 PVE experience** when one of the players enters AI mode.

---

## Installation

Before running the project, ensure that dependencies are installed correctly and generate certificates for HTTPS.

### Steps to Install

1. **Install Node.js**:
   - Download and install Node.js from the [official website](https://nodejs.org/).

2. **Install Dependencies**:
   ```bash
   npm init -y
   npm install express socket.io
   ```

3. **Install mkcert and Generate Certificates**:
   - If you're using Windows, you can install mkcert via Chocolatey:
   ```bash
   choco install mkcert
   ```
   - Then, run the following commands to generate certificates:
   ```bash
   mkcert -install
   mkcert <your_local_IP> localhost 127.0.0.1 ::1
   mv <localIP>+2.pem server.pem
   mv <localIP>+2-key.pem server-key.pem
   mkdir certs
   mv server.pem certs/
   mv server-key.pem certs/
   ```

---

## Running the Project

To run the project, navigate to the root directory in your command line and execute:

```bash
node server.js
```

Alternatively, you can double-click the `run_local_server.bat` file.

---

## Mode Configuration

- **PVP Mode**:
  - Both players should select the default control mode **"Motion"** on the control mode selection page.

- **PVE Mode**:
  - The player should select the default control mode **"Motion"** on the control mode selection page.
  - The AI client should press **'C'** (AI with physical installation) or **'D'** (AI without physical installation) on the control mode selection page.

---

## Physical Installation

This project includes a physical installation in one of the PVE modes (when 'C' is pressed on the control mode selection page).

- **Description**: The physical installation features two robotic hands that create an illusion of operating the game during gameplay.
- **Setup**: If adopted, connect the Arduino board to the client running the AI.

![Picture][]  *Schematic:*  ![Schematic][]

---

Feel free to reach out if you have any questions or need further assistance!