const { randomUUID } = require('crypto');

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		KEY_AUTHORIZATION: randomUUID(),
		BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
		ALIBABA_KEY_ID: process.env.ALIBABA_KEY_ID,
		ALIBABA_KEY_SECRET: process.env.ALIBABA_KEY_SECRET,
	},
};

module.exports = nextConfig;
