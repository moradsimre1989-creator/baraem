import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages يخدم المشروع تحت مسار فرعي (‎/baraem/‎)، بينما التطوير المحلي
  // ونسخة الـ Artifact في الجذر. المتغيّر يُضبط في خطوة النشر وحدها، فلا يتغيّر
  // أي سلوك محلي. راجع src/utils/asset.js لمسارات الصوت والفيديو.
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  resolve: {
    alias: {
      // alias بأسلوب shadcn: "@/..." يشير إلى مجلد src
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // يضمّن الصور كـ base64 داخل الحزمة، حتى تبقى نسخة الـ Artifact ملفاً واحداً مكتفياً بذاته.
    assetsInlineLimit: 3_000_000,
  },
})
