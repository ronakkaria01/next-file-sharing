/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: [
                `${process.env.NEXT_PUBLIC_DOCKER_IP}`
            ]
        }
    }
};

export default nextConfig;
