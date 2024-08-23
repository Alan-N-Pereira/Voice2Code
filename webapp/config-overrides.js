const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
// const nodeExternals = require('webpack-node-externals');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    path: require.resolve('path-browserify'),
    fs: false,
    buffer: require.resolve('buffer/'),
    process: require.resolve('process/browser'),
  };

  config.plugins = (config.plugins || []).concat([
    new NodePolyfillPlugin(),
  ]);

  // config.externals = [
  //   ...config.externals || [],
  //   nodeExternals({
  //     allowlist: [/^webpack/],
  //   }),
  // ];

  return config;
};