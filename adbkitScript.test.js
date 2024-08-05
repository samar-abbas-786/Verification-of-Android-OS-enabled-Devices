const {
  listDevices,
  connectDevice,
  runTest,
  getNetworkOperator,
  checkNetwork,
  sendTextToDevice,
  scrollDown,
  click,
  writeText,
} = require("./adb.js"); // Adjust the path as necessary

describe("ADBKit Script", () => {
  jest.setTimeout(10000); // Set a longer timeout for potentially slow operations

  test("should list devices", async () => {
    const devices = await listDevices();
    expect(Array.isArray(devices)).toBe(true);
  });

  test("should connect to a device", async () => {
    const ip = "192.168.1.101"; // Use a test IP address
    const result = await connectDevice(ip);
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("type");
  });

  test("should run a test command on a device", async () => {
    const devices = await listDevices();
    if (devices.length > 0) {
      const deviceId = devices[0].id;
      const output = await runTest(deviceId, "echo hello");
      expect(output.trim()).toBe("hello");
    } else {
      console.warn("No devices connected; skipping test.");
    }
  });

  test("should get the network operator", async () => {
    const devices = await listDevices();
    if (devices.length > 0) {
      const deviceId = devices[0].id;
      const operator = await getNetworkOperator(deviceId);
      expect(typeof operator).toBe("string");
    } else {
      console.warn("No devices connected; skipping test.");
    }
  });

  test("should send text to device", async () => {
    const devices = await listDevices();
    if (devices.length > 0) {
      const deviceId = devices[0].id;
      await sendTextToDevice("Hello World");
      // Assume it works if no error is thrown
    } else {
      console.warn("No devices connected; skipping test.");
    }
  });

  test("should scroll down on the device", async () => {
    const devices = await listDevices();
    if (devices.length > 0) {
      const deviceId = devices[0].id;
      await scrollDown(deviceId);
      // Assume it works if no error is thrown
    } else {
      console.warn("No devices connected; skipping test.");
    }
  });

  test("should click on the device", async () => {
    const devices = await listDevices();
    if (devices.length > 0) {
      const deviceId = devices[0].id;
      await click(deviceId, 200, 1500);
      // Assume it works if no error is thrown
    } else {
      console.warn("No devices connected; skipping test.");
    }
  });

  test("should write text to the device", async () => {
    const devices = await listDevices();
    if (devices.length > 0) {
      const deviceId = devices[0].id;
      await writeText(deviceId, "Hello SAMAR ABBAS");
      // Assume it works if no error is thrown
    } else {
      console.warn("No devices connected; skipping test.");
    }
  });

  test("should check network operator", async () => {
    const devices = await listDevices();
    if (devices.length > 0) {
      const deviceId = devices[0].id;
      const expectedNetwork = "Expected Network"; // Replace with the actual expected network
      const actualNetwork = await getNetworkOperator(deviceId);
      expect(actualNetwork).toBe(expectedNetwork);
    } else {
      console.warn("No devices connected; skipping test.");
    }
  });
});
