module.exports = {
  reactStrictMode: true,
  transpilePackages: [
    "@eden/package-ui",
    "@eden/package-context",
    "@eden/package-graphql",
    "@eden/package-mock",
  ],
  images: { domains: ["pbs.twimg.com"], formats: ["image/avif"] },
};
