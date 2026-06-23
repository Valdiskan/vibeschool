/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ← ГЛАВНОЕ! Создаёт папку .next/standalone

  // Если используешь изображения
  images: {
    unoptimized: true,
  },

  // Если есть middleware или edge-runtime
  // experimental: {
  //   outputFileTracingRoot: import.meta.dirname,
  // },
};

export default nextConfig;
