const adb = require("adbkit");
const client = adb.createClient();
// const chai = require("chai");
// const expect = chai.expect;

async function listPackages() {
  const devices = await client.listDevices();
  const deviceId = devices[0].id;
  const packages = await client.getPackages(deviceId);
  //   console.log(packages);
  return packages;
}
// listPackages();

//Launch App
async function launchApp(packageName) {
  const devices = await client.listDevices();
  const deviceId = devices[0].id;
  // await client.shell(deviceId,`am start -n ${packageName}`);
  await client.startActivuty(deviceId, {packageName });
}

//Test Case Example

async function test() {
  const packages = await listPackages();
  console.log("installed packages", packages);
  // expect(packages).to.include("com.example.myapp");
  await launchApp("com.example.myapp");
  console.log("App Launched");
}

test().catch((err) => {
  console.log("The test error:", err);
});



