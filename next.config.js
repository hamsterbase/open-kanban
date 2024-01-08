/** @type {import('next').NextConfig} */
const { version } = require("./package.json");

const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    version,
  },
};

module.exports = nextConfig;
