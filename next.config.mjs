import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin tracing root explicitly so Vercel's modifyConfig doesn't hit
  // a path.* call with undefined when auto-detection returns nothing.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
