import util from "@akinsgre/kayak-strava-utility";
// Mock SystemJS
global.System = {
  import: jest.fn(mockImport),
};

function mockImport(importName) {
  if (importName === "@akinsgre/kayak-strava-utility") {
    return Promise.resolve(util);
  } else {
    console.warn("No mock module found");
    return Promise.resolve({});
  }
}
