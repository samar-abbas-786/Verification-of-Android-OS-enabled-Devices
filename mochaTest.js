const adb = require("adbkit");
const client = adb.createlient();
const chai = require("chai");
const expect = chai.expect;

describe("Android Automation Tests", function () {
  it("should list installed packages", async function () {
    const devices = await client.listDevices();
    const deviceId = devices[0].id;
    const packages = await client.getPackages(deviceId);
    console.log("Installed packages:", packages);
    expect(packages).to.include("com.example.myapp"); // Replace with your app package name
  });

  it("should launch an app", async function () {
    const devices = await client.listDevices();
    const deviceId = devices[0].id;
    await client.startActivity(deviceId, { packageName: "com.example.myapp" }); // Replace with your app package name
    console.log("App launched");
  });
});


async function installApk(apkPath) {
    const devices = await client.listDevices();
    const deviceId = devices[0].id;
    await client.install(deviceId, apkPath);
    console.log('APK installed');
  }

  const fs = require('fs');

async function captureScreenshot() {
  const devices = await client.listDevices();
  const deviceId = devices[0].id;
  const image = await client.screencap(deviceId);
  image.pipe(fs.createWriteStream('screenshot.png'));
  console.log('Screenshot captured');
}

async function tapElement(resourceId) {
    const devices = await client.listDevices();
    const deviceId = devices[0].id;
    await client.shell(deviceId, `input tap ${resourceId}`);
    console.log('Element tapped');
  }
  