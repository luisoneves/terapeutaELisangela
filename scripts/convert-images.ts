#!/usr/bin/env pnpm tsx
/**
 * Script de conversão de imagens para WebP
 * =========================================
 * 
 * USO:
 *   pnpm convert-images
 * 
 * O que faz:
 *   - Converte todas as imagens JPG/PNG para WebP
 *   - Mantém originais como fallback
 *   - Otimiza tamanho mantendo qualidade
 * 
 * CONFIGURAÇÃO:
 *   Edite as variáveis abaixo para ajustar qualidade
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const INPUT_DIR = './public';
const QUALITY = 80;

// Extensões para converter
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];

interface ConversionResult {
  success: boolean;
  file: string;
  originalSize?: number;
  newSize?: number;
  error?: string;
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const convertImage = async (filePath: string): Promise<ConversionResult> => {
  const ext = path.extname(filePath).toLowerCase();
  const baseName = path.basename(filePath, ext);
  const dir = path.dirname(filePath);
  const outputPath = path.join(dir, `${baseName}.webp`);

  try {
    const originalStats = fs.statSync(filePath);
    const originalSize = originalStats.size;

    // Converter para WebP
    await sharp(filePath)
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const newStats = fs.statSync(outputPath);
    const newSize = newStats.size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    return {
      success: true,
      file: baseName,
      originalSize,
      newSize
    };
  } catch (error) {
    return {
      success: false,
      file: baseName,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

const getImages = (dir: string): string[] => {
  const files = fs.readdirSync(dir);
  return files
    .filter(file => EXTENSIONS.includes(path.extname(file).toLowerCase()))
    .map(file => path.join(dir, file));
};

const main = async () => {
  console.log('\n🖼️  Conversor de Imagens para WebP\n');
  console.log(`📁 Diretório: ${INPUT_DIR}`);
  console.log(`📊 Qualidade: ${QUALITY}%\n`);

  const images = getImages(INPUT_DIR);

  if (images.length === 0) {
    console.log('⚠️  Nenhuma imagem para converter.');
    return;
  }

  console.log(`Encontradas ${images.length} imagem(ns):\n`);

  const results: ConversionResult[] = [];
  let totalOriginal = 0;
  let totalNew = 0;

  for (const image of images) {
    const result = await convertImage(image);
    results.push(result);

    if (result.success && result.originalSize && result.newSize) {
      totalOriginal += result.originalSize;
      totalNew += result.newSize;
      const savings = ((result.originalSize - result.newSize) / result.originalSize * 100).toFixed(1);
      console.log(`  ✅ ${result.file}.webp`);
      console.log(`     ${formatBytes(result.originalSize)} → ${formatBytes(result.newSize)} (${savings}% menor)\n`);
    } else {
      console.log(`  ❌ ${result.file}: ${result.error}\n`);
    }
  }

  // Resumo
  console.log('─'.repeat(50));
  console.log('\n📊 RESUMO:\n');
  console.log(`  Total de imagens: ${results.filter(r => r.success).length}/${images.length}`);
  console.log(`  Tamanho original: ${formatBytes(totalOriginal)}`);
  console.log(`  Tamanho final:   ${formatBytes(totalNew)}`);
  const totalSavings = ((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1);
  console.log(`  Economia:         ${totalSavings}%\n`);

  console.log('💡 Para usar no código:\n');
  console.log('  <!-- Substitua -->');
  console.log('  <img src="/imagem.jpg" />\n');
  console.log('  <!-- Por -->');
  console.log('  <picture>');
  console.log('    <source srcset="/imagem.webp" type="image/webp" />');
  console.log('    <img src="/imagem.jpg" alt="..." />');
  console.log('  </picture>\n');

  console.log('✅ Concluído!\n');
};

main().catch(console.error);
