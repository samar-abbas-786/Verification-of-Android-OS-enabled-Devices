const adb = require("adbkit");
const client = adb.createClient();
const fs = require("fs");
const { createWorker } = require("tesseract.js");

const path = require("path");
const apkPath = path.resolve(
  __dirname,
  "C:\\Users\\HP\\Downloads\\1.1.1.1 + WARP_ Safer Internet_6.33_APKPure.apk"
);

// async function listDevices() {
//   try {
//     const devices = await client.listDevices();
//     console.log("Connected devices:", devices);
//     return devices;
//   } catch (err) {
//     console.log("Error occurred:", err);
//     throw err;
//   }
// }

// async function connectDevice(ip) {
//   try {
//     const connect = await client.connect(ip, 5555);
//     console.log("Connected to device:", ip);
//     return connect;
//   } catch (err) {
//     console.log("Error occurred:", err);
//     throw err;
//   }
// }

// async function runTest(deviceId, testCommand) {
//   try {
//     const result = await client.shell(deviceId, testCommand);
//     const output = await adb.util.readAll(result);
//     const resultString = output.toString();
//     console.log(`Test result on ${deviceId}:`, resultString);
//     return resultString;
//   } catch (err) {
//     console.log(`Failed test on ${deviceId}:`, err);
//     throw err;
//   }
// }

// client
//   .listDevices()
//   .then((devices) => {
//     if (devices.length === 0) {
//       console.log("No devices connected");
//       return;
//     }

//     devices.forEach((device) => {
//       console.log(`Device ID: ${device.id}`);

//       client
//         .getProperties(device.id)
//         .then((properties) => {
//           console.log("Device Properties:");
//           // console.log(properties);

//           const details = {
//             model: properties["ro.product.model"],
//             brand: properties["ro.product.brand"],
//             androidVersion: properties["ro.build.version.release"],
//             sdkVersion: properties["ro.build.version.sdk"],
//           };

//           // console.log('Specific Details:');
//           console.log(details);
//         })
//         .catch((err) => {
//           console.error("Error getting properties:", err);
//         });
//     });
//   })
//   .catch((err) => {
//     console.error("Error listing devices:", err);
//   });

// client
//   .listDevices()
//   .then((devices) => {
//     if (devices.length === 0) {
//       console.log("No Device Connected");
//       return;
//     }
//     devices.forEach((device) => {
//       console.log(`Device id: ${device.id}`);

//       client
//         .install(device.id, apkPath)
//         .then(() => {
//           console.log(
//             `Successfully installed ${apkPath} on device ${device.id}`
//           );
//         })
//         .catch((err) => {
//           console.error(
//             `Failed to install ${apkPath} on device ${device.id}:`,
//             err
//           );
//         });
//     });
//   })
//   .catch((err) => {
//     console.error("Error listing devices:", err);
//   });

// client.listDevices()
//   .then((devices) => {
//     if (devices.length === 0) {
//       console.log("No Device Connected");
//       return;
//     }

//     devices.forEach((device) => {
//       console.log(`Device id: ${device.id}`);

//       // Fetch installed packages on the device
//       client.getPackages(device.id)
//         .then((packages) => {
//           console.log(`Installed packages on device ${device.id}:`);
//           packages.forEach((pkg) => {
//             console.log(pkg); // Log each package name
//           });
//         })
//         .catch((err) => {
//           console.error(`Failed to get packages from device ${device.id}:`, err);
//         });
//     });
//   })
//   .catch((err) => {
//     console.error("Error listing devices:", err);
//   });
async function takeScreenshot() {
  try {
    // List connected devices
    const devices = await client.listDevices();

    if (devices.length === 0) {
      console.log("No device connected");
      return;
    }

    // Take a screenshot on the first connected device
    const deviceId = devices[0].id;

    // Capture screenshot
    const screenshot = await client.shell(deviceId, "screencap -p");
    const chunks = [];

    screenshot.on("data", (chunk) => chunks.push(chunk));
    screenshot.on("end", () => {
      // Combine all chunks into a single buffer
      const buffer = Buffer.concat(chunks);
      // Save to file
      const screenshotPath = path.join(__dirname, "screenshot.png");
      fs.writeFileSync(screenshotPath, buffer);
      console.log("Screenshot saved as screenshot.png");

      // Perform OCR on the saved screenshot
      performOCR(screenshotPath);
    });
  } catch (err) {
    console.error("Failed to take screenshot:", err);
  }
}

async function performOCR(imagePath) {
  const worker = createWorker(); // Initialize the worker

  try {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    const {
      data: { text },
    } = await worker.recognize(imagePath);

    console.log("Extracted text:", text);
  } catch (err) {
    console.error("Failed to perform OCR:", err);
  } finally {
    await worker.terminate(); // Terminate the worker
  }
}

// Call the function to take a screenshot and perform OCR
takeScreenshot();
// module.exports = { listDevices, connectDevice, runTest };
