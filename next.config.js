/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack: (config, { isServer }) => {
        if (!isServer) {
          config.resolve.fallback = {
            dns: false,
            fs: false,
            net: false,
            tls: false,
          };
        }
        return config;
      },
};

module.exports = nextConfig;
