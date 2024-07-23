const express = require("express");
const app = express();
const { listDevices, connectDevice, runTest } = require("./adb");
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Working Fine");
});

app.get("/alldevices", async (req, res) => {
  try {
    const devices = await listDevices();
    res.status(200).send(devices);
  } catch (err) {
    res.status(500).send({ error: 'Failed to list devices' });
  }
});

app.post("/connect-ip", async (req, res) => {
  try {
    const { ip } = req.body;
    const connectDeviceResponse = await connectDevice(ip);
    res.status(200).send(connectDeviceResponse);
  } catch (err) {
    res.status(500).send({ error: 'Failed to connect to device' });
  }
});

app.post("/test-run", async (req, res) => {
  try {
    const { deviceId, testCommand } = req.body;
    const result = await runTest(deviceId, testCommand);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).send({ error: `Test failed on device ${deviceId}` });
  }
});

app.listen(PORT, () => console.log(`App is running at ${PORT}`));
