const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const Dotenv = require("dotenv-webpack");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "akinsgre",
    projectName: "kayak-strava",
    webpackConfigEnv,
    argv,
  });
  return merge(defaultConfig, {
    devServer: {
      headers: { "Access-Control-Allow-Origin": "*" },
    },
    plugins: [],
  });
};
