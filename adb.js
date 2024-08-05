const adb = require("adbkit");
const client = adb.createClient();
const fs = require("fs");
const xml2js = require("xml2js");
const { createWorker } = require("tesseract.js");

const path = require("path");
const apkPath = path.resolve(
  __dirname,
  "C:\\Users\\HP\\Downloads\\1.1.1.1 + WARP_ Safer Internet_6.33_APKPure.apk"
);

async function listDevices() {
  try {
    const devices = await client.listDevices();
    console.log("Connected devices:", devices);
    return devices;
  } catch (err) {
    console.log("Error occurred:", err);
    throw err;
  }
}

async function connectDevice(ip) {
  try {
    const connect = await client.connect(ip, 5555);
    console.log("Connected to device:", ip);
    return connect;
  } catch (err) {
    console.log("Error occurred:", err);
    throw err;
  }
}

async function runTest(deviceId, testCommand) {
  try {
    const result = await client.shell(deviceId, testCommand);
    const output = await adb.util.readAll(result);
    const resultString = output.toString();
    console.log(`Test result on ${deviceId}:`, resultString);
    return resultString;
  } catch (err) {
    console.log(`Failed test on ${deviceId}:`, err);
    throw err;
  }
}

client
  .listDevices()
  .then((devices) => {
    if (devices.length === 0) {
      console.log("No devices connected");
      return;
    }

    devices.forEach((device) => {
      console.log(`Device ID: ${device.id}`);

      client
        .getProperties(device.id)
        .then((properties) => {
          console.log("Device Properties:");
          // console.log(properties);

          const details = {
            model: properties["ro.product.model"],
            brand: properties["ro.product.brand"],
            androidVersion: properties["ro.build.version.release"],
            sdkVersion: properties["ro.build.version.sdk"],
          };

          // console.log('Specific Details:');
          console.log(details);
        })
        .catch((err) => {
          console.error("Error getting properties:", err);
        });
    });
  })
  .catch((err) => {
    console.error("Error listing devices:", err);
  });

client
  .listDevices()
  .then((devices) => {
    if (devices.length === 0) {
      console.log("No Device Connected");
      return;
    }
    devices.forEach((device) => {
      console.log(`Device id: ${device.id}`);

      client
        .install(device.id, apkPath)
        .then(() => {
          console.log(
            `Successfully installed ${apkPath} on device ${device.id}`
          );
        })
        .catch((err) => {
          console.error(
            `Failed to install ${apkPath} on device ${device.id}:`,
            err
          );
        });
    });
  })
  .catch((err) => {
    console.error("Error listing devices:", err);
  });

client
  .listDevices()
  .then((devices) => {
    if (devices.length === 0) {
      console.log("No Device Connected");
      return;
    }

    devices.forEach((device) => {
      console.log(`Device id: ${device.id}`);

      // Fetch installed packages on the device
      client
        .getPackages(device.id)
        .then((packages) => {
          console.log(`Installed packages on device ${device.id}:`);
          packages.forEach((pkg) => {
            console.log(pkg); // Log each package name
          });
        })
        .catch((err) => {
          console.error(
            `Failed to get packages from device ${device.id}:`,
            err
          );
        });
    });
  })
  .catch((err) => {
    console.error("Error listing devices:", err);
  });
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
      // performOCR(screenshotPath);
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
async function runTest(deviceId, testCommand) {
  try {
    const result = await client.shell(deviceId, testCommand);
    const output = await adb.util.readAll(result);
    const resultString = output.toString();
    console.log(`Test result on ${deviceId}:`, resultString);
    return resultString;
  } catch (err) {
    console.log(`Failed test on ${deviceId}:`, err);
    throw err;
  }
}
runTest();
const ScreenRecord = async () => {
  let deviceId; // Declare deviceId outside of try block for access in finally

  try {
    // List all connected devices
    const devices = await client.listDevices();
    if (devices.length === 0) {
      console.log("No devices connected");
      return;
    }
    deviceId = devices[0].id;

    // Start screen recording with a time limit of 10 seconds
    const remotePath = "/storage/emulated/0/recordedVideo.mp4";
    const command = `screenrecord --time-limit 10 ${remotePath}`;
    await client.shell(deviceId, command);

    // Pull the video file from the device to the local machine
    const transfer = await client.pull(deviceId, remotePath);
    const recordVideoPath = path.join(__dirname, "recordedVideo.mp4");

    // Write the pulled file to the local filesystem
    return new Promise((resolve, reject) => {
      const outStream = fs.createWriteStream(recordVideoPath);
      transfer.pipe(outStream);
      transfer.on("end", () => {
        console.log("recordedVideo saved as recordedVideo.mp4");
        resolve();
      });
      transfer.on("error", (err) => {
        console.error("Failed to save recorded video:", err);
        reject(err);
      });
    });
  } catch (err) {
    console.error("An error occurred:", err);
  } finally {
    // Clean up: remove the video file from the device
    if (deviceId) {
      try {
        await client.shell(deviceId, `rm ${remotePath}`);
      } catch (cleanupErr) {
        console.error("Failed to remove video file from device:", cleanupErr);
      }
    }
  }
};

// Execute the function
ScreenRecord();
const sendTextToDevice = async (text) => {
  try {
    const devices = await client.listDevices();
    if (devices.length === 0) {
      console.log("No devices connected");
      return;
    }
    const deviceId = devices[0].id;

    // Replace spaces with %s as required by the adb shell input command
    const encodedText = text.replace(/ /g, "%s");
    await client.shell(deviceId, `input text "${encodedText}"`);
    console.log(`Text "${text}" sent to device.`);
  } catch (err) {
    console.error("An error occurred:", err);
  }
};

// Example usage
sendTextToDevice("Hello World");

// Scrolling Function
async function scrollDown(deviceId) {
  try {
    // Define the starting and ending coordinates for the swipe action.
    const startX = 500; // x-coordinate for the start of the swipe
    const startY = 1000; // y-coordinate for the start of the swipe
    const endX = 500; // x-coordinate for the end of the swipe
    const endY = 200; // y-coordinate for the end of the swipe
    const duration = 500; // Duration of the swipe in ms

    // Perform the swipe action
    await client.shell(
      deviceId,
      `input swipe ${startX} ${startY} ${endX} ${endY} ${duration}`
    );
    console.log("Scroll down action performed");
  } catch (err) {
    console.error("Error performing scroll action:", err);
  }
}

// Replace 'device-id' with your device's ID or keep it empty to use the first connected device
client
  .listDevices()
  .then((devices) => {
    if (devices.length === 0) {
      throw new Error("No devices connected");
    }
    const deviceId = devices[0].id; // Use the first connected device
    scrollDown(deviceId);
  })
  .catch((err) => {
    console.error("Error:", err);
  });

//  CLICK FUNCTION

async function click(deviceId, x, y) {
  try {
    // Perform the tap action at the specified coordinates (x, y)
    await client.shell(deviceId, `input tap ${x} ${y}`);
    console.log(`Clicked at coordinates (${x}, ${y})`);
  } catch (err) {
    console.error("Error performing click action:", err);
  }
}

// Replace 'device-id' with your device's ID or leave it empty to use the first connected device
client
  .listDevices()
  .then((devices) => {
    if (devices.length === 0) {
      throw new Error("No devices connected");
    }
    const deviceId = devices[0].id; // Use the first connected device
    const x = 200; // x-coordinate where the tap will be performed
    const y = 1500; // y-coordinate where the tap will be performed
    click(deviceId, x, y);
  })
  .catch((err) => {
    console.error("Error:", err);
  });

// Reding-Writing text
async function writeText(deviceId, text) {
  try {
    // Encode the text to handle spaces and special characters
    const encodedText = encodeURIComponent(text);
    // Perform the input text action
    await client.shell(deviceId, `input text "${encodedText}"`);
    console.log(`Text "${text}" written to the device`);
  } catch (err) {
    console.error("Error writing text:", err);
  }
}

// Replace 'device-id' with your device's ID or leave it empty to use the first connected device
client
  .listDevices()
  .then((devices) => {
    if (devices.length === 0) {
      throw new Error("No devices connected");
    }
    const deviceId = devices[0].id; // Use the first connected device
    const text = "Hello SAMAR ABBAS"; // Text to write
    writeText(deviceId, text);
  })
  .catch((err) => {
    console.error("Error:", err);
  });

//Hardcoded

// Load the configuration file
const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));

async function getNetworkOperator(deviceId) {
  try {
    // Get the network operator name using adb shell command
    const operator = await client.shell(deviceId, "getprop gsm.operator.alpha");
    return (await adb.util.readAll(operator)).toString().trim();
  } catch (err) {
    console.error(`Error getting network operator for ${deviceId}:`, err);
    return null;
  }
}

async function checkNetwork(deviceId, expectedNetwork) {
  const actualNetwork = await getNetworkOperator(deviceId);
  if (actualNetwork) {
    if (actualNetwork === expectedNetwork) {
      console.log(`PASS: Device ${deviceId} is connected to ${actualNetwork}`);
    } else {
      console.log(
        `FAIL: Device ${deviceId} is connected to ${actualNetwork} instead of ${expectedNetwork}`
      );
    }
  }
}

client
  .listDevices()
  .then(async (devices) => {
    if (devices.length === 0) {
      throw new Error("No devices connected");
    }

    for (const device of devices) {
      const deviceId = device.id;
      const expectedNetwork = config.devices[deviceId];

      if (expectedNetwork) {
        await checkNetwork(deviceId, expectedNetwork);
      } else {
        console.warn(`No expected network specified for device ${deviceId}`);
      }
    }
  })
  .catch((err) => {
    console.error("Error:", err);
  });

// Export the functions
module.exports = {
  listDevices,
  connectDevice,
  runTest,
  getNetworkOperator,
  checkNetwork,
  sendTextToDevice,
  scrollDown,
  click,
  writeText,
};

// module.exports = { listDevices, connectDevice, runTest };
// module.exports = { listDevices,runTest };
