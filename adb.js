const adb = require("adbkit");
const client = adb.createClient();
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

// module.exports = { listDevices, connectDevice, runTest };
