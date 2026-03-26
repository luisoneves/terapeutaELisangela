import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

/**
 * Vite Configuration
 * ==================
 * 
 * Este arquivo configura o Vite para o projeto de landing page
 * 
 * PLUGINS:
 * - react(): Suporte a React com Fast Refresh
 * 
 * ALIAS:
 * - @: Aponta para ./src ( facilita imports )
 * 
 * BASE:
 * - './': Configuração para deploy em subdirectórios
 */

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
