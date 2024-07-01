const adb = require("adbkit");
const client = adb.createClient();

async function listdevices() {
  try {
    const devices = await client.listDevices();
    return devices;
    console.log("Connected devices", devices);
  } catch (err) {
    console.log("Error Occured", err);
  }
}

async function connectedDevies(ip) {
  try {
    const connect = await client.connect(ip, 5555);
    return connect;
    console.log("connected to devices", ip);
  } catch (err) {
    console.log("Error Occured", err);
  }
}

async function runTest(deviceId, testCommand) {
  try {
    const result = await client.shell(deviceId, testCommand);
    console.log(`Test result on ${deviceId} is`, result.toString());
    return result.toString();
  } catch (err) {
    console.log(`Failed test on ${deviceId}`, err);
  }
}

module.exports = { listdevices, connectedDevies, runTest };
