/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DB_SERVER: process.env.DB_SERVER,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig