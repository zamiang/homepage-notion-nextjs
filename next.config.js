const withPlugins = require('next-compose-plugins');
const { createSecureHeaders } = require('next-secure-headers');
const withFonts = require('next-fonts');
const withReactSvg = require('next-react-svg');
const path = require('path');

const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	webpack5: true,

	async rewrites() {
		return [
			{
				source: '/sitemap.xml',
				destination: '/api/sitemap',
			},
		];
	},

	async headers() {
		return [
			{
				source: '/(.*)',
				headers: createSecureHeaders({
					contentSecurityPolicy: {
						directives: {
							defaultSrc: "'self'",
							styleSrc: ["'self'", "'unsafe-inline'"],
							imgSrc: ["'self'", 'data:', 'https://www.googletagmanager.com'],
							fontSrc: ["'self'"],
							scriptSrc: [
								"'self'",
								"'unsafe-eval'",
								"'unsafe-inline'",
								'https://www.googletagmanager.com',
							],
							frameSrc: [],
							connectSrc: ["'self'", 'https://www.googleapis.com'],
						},
					},
					forceHTTPSRedirect: true,
					referrerPolicy: 'same-origin',
					xssProtection: 'block-rendering',
				}),
			},
		];
	},
};

module.exports = withPlugins(
	[
		[
			withFonts,
			{
				reactStrictMode: true,
				poweredByHeader: false,
			},
		],
		[
			withReactSvg,
			{
				include: path.resolve(__dirname, 'public'),
			},
		],
	],
	nextConfig,
);
