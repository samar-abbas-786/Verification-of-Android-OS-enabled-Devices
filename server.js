const express = require("express");
const app = express();
const { listdevices, connectedDevies, runTest } = require("./adb");
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Working FIne");
});
app.get("/alldevices", async (req, res) => {
  const devices = await listdevices();
  res.send(devices);
});

app.post("/connect-ip", async (req, res) => {
  try {
    const { ip } = req.body;
    const connectDevice = await connectedDevies(ip);
    console.log("connected to ", connectDevice);
  } catch (err) {
    console.log("error occured", err);
  }
});

app.post("/test-run", async (req, res) => {
  try {
    const { deviceId, testCommand } = req.body;
    const result = await runTest(deviceId, testCommand);
    res.json({ result });
  } catch (err) {
    console.log(`Test failed on server side on ${deviceId}`, err);
  }
});

app.listen(PORT, console.log(`App is Runnning at ${PORT}`));
