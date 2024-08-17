# Android Device Test Automation Framework

This project is an Android Device Test Automation Framework built using Node.js, Express.js, and ADBKit. The framework allows you to connect Android devices, perform automated testing, and log results. You can list devices, fetch device properties, install APKs, fetch installed packages, take screenshots, send text to a device, and scroll down on the device screen. The results of the tests are logged and displayed on the front end.

## Features

- **Device Connection**: Automatically detects connected Android devices via ADB.
- **Test Case Execution**: Includes various test cases like listing devices, getting device properties, installing APKs, fetching installed packages, taking screenshots, sending text to devices, and scrolling down.
- **Logging**: Logs the results of the test cases to a log file (`logfile.log`).
- **Frontend Interface**: A web interface to display connected devices, test cases, and buttons to run individual or all tests.

## Getting Started

### Prerequisites

To get started, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- ADB (Android Debug Bridge)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/android-test-automation.git
   cd android-test-automation

2. **Install dependencies:**

```bash
npm install

3. **Ensure ADB is working: Ensure that adb is added to your system's PATH and that it can recognize connected Android devices:**

```bash
adb devices



   

