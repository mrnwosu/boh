#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { Command } from 'commander';
import { getDocument } from 'pdfjs-dist';

interface ParsedImage {
  index: number;
  page: number;
  width: number;
  height: number;
  kind: string;
}

interface ParseResult {
  content: string;
  images: ParsedImage[];
}

interface CliOptions {
  output?: string;
  images?: string;
  verbose?: boolean;
  json?: boolean;
}

/**
 * Parse PDF and extract text and images
 */
async function parsePDF(pdfPath: string): Promise<ParseResult> {
  if (!fs.existsSync(pdfPath)) {
    throw new Error(`PDF file not found: ${pdfPath}`);
  }

  const fileBuffer = fs.readFileSync(pdfPath);
  const pdfDoc = await getDocument({ data: fileBuffer }).promise;

  const content: string[] = [];
  let imageIndex = 0;
  const images: ParsedImage[] = [];

  // Process each page
  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);

    // Extract text
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => (item.str || ''))
      .join('');

    if (pageText.trim()) {
      content.push(pageText);
    }

    // Extract images
    const operatorList = await page.getOperatorList();
    const fnArray = operatorList.fnArray;
    const argsArray = operatorList.argsArray;

    for (let i = 0; i < fnArray.length; i++) {
      if (fnArray[i] === 83) { // OPS.paintImageXObject
        try {
          const imageName = argsArray[i][0];
          const image = await page.objs.get(imageName);

          if (image) {
            const imageData: ParsedImage = {
              index: imageIndex,
              page: pageNum,
              width: image.width,
              height: image.height,
              kind: image.kind,
            };

            images.push(imageData);
            content.push(`{{IMAGE:${imageIndex}}}`);
            imageIndex++;
          }
        } catch (error) {
          // Skip images that can't be extracted
        }
      }
    }

    content.push('\n'); // Add page separator
  }

  return { content: content.join(''), images };
}

/**
 * Extract and save images from PDF
 */
async function extractImages(pdfPath: string, outputDir: string, verbose: boolean = false): Promise<any[]> {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fileBuffer = fs.readFileSync(pdfPath);
  const pdfDoc = await getDocument({ data: fileBuffer }).promise;

  const extractedImages: any[] = [];
  let imageIndex = 0;

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const operatorList = await page.getOperatorList();
    const fnArray = operatorList.fnArray;
    const argsArray = operatorList.argsArray;

    for (let i = 0; i < fnArray.length; i++) {
      if (fnArray[i] === 83) { // OPS.paintImageXObject
        try {
          const imageName = argsArray[i][0];
          const image = await page.objs.get(imageName);

          if (image && image.data) {
            // Save image data as raw binary
            const imageBuffer = Buffer.from(image.data);
            const filename = `image_${imageIndex}.raw`;
            const filepath = path.join(outputDir, filename);
            fs.writeFileSync(filepath, imageBuffer);

            const imageInfo = {
              index: imageIndex,
              filename,
              filepath,
              width: image.width,
              height: image.height,
            };

            if (verbose) {
              console.error(`  Extracted image ${imageIndex}: ${filename} (${image.width}x${image.height})`);
            }

            extractedImages.push(imageInfo);
            imageIndex++;
          }
        } catch (error) {
          // Skip images that can't be extracted
        }
      }
    }
  }

  return extractedImages;
}

/**
 * Parse command
 */
async function handleParse(pdfPath: string, options: CliOptions): Promise<void> {
  const verbose = options.verbose || false;

  if (verbose) console.error(`📄 Parsing PDF: ${pdfPath}`);

  const result = await parsePDF(pdfPath);

  let output = result.content;

  if (options.images) {
    if (verbose) console.error(`🖼️  Extracting images to: ${options.images}`);
    const images = await extractImages(pdfPath, options.images, verbose);
    if (verbose) console.error(`✓ Extracted ${images.length} images`);
  }

  if (options.output) {
    fs.writeFileSync(options.output, output, 'utf-8');
    if (verbose) console.error(`✓ Output saved to: ${options.output}`);
  } else {
    console.log(output);
  }

  if (verbose) console.error(`✓ Found ${result.images.length} images in total`);
}

/**
 * Info command
 */
async function handleInfo(pdfPath: string, options: CliOptions): Promise<void> {
  const verbose = options.verbose || false;

  if (verbose) console.error(`📄 Analyzing PDF: ${pdfPath}`);

  const result = await parsePDF(pdfPath);

  const info = {
    file: pdfPath,
    totalImages: result.images.length,
    images: result.images,
    textLength: result.content.length,
  };

  if (options.json) {
    console.log(JSON.stringify(info, null, 2));
  } else {
    console.log(`\n📊 PDF Information:`);
    console.log(`   File: ${info.file}`);
    console.log(`   Total Images: ${info.totalImages}`);
    console.log(`   Text Length: ${info.textLength} characters`);

    if (info.images.length > 0) {
      console.log(`\n   Image Details:`);
      info.images.forEach((img) => {
        console.log(`     - Image ${img.index}: Page ${img.page}, ${img.width}x${img.height} (${img.kind})`);
      });
    }
    console.log();
  }
}

/**
 * Main CLI setup
 */
function main(): void {
  const program = new Command();

  program
    .name('pdf-parser')
    .description('Parse PDF files and extract text with image markers')
    .version('1.0.0');

  // Parse command
  program
    .command('parse <file>')
    .description('Parse PDF and output text with image markers')
    .option('-o, --output <file>', 'Save output to file (default: stdout)')
    .option('-i, --images <dir>', 'Extract images to directory')
    .option('-v, --verbose', 'Verbose output')
    .action(async (file, options) => {
      try {
        await handleParse(file, options);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`❌ Error: ${error.message}`);
        } else {
          console.error('❌ An unknown error occurred');
        }
        process.exit(1);
      }
    });

  // Info command
  program
    .command('info <file>')
    .description('Show PDF information (page count, images, etc.)')
    .option('-j, --json', 'Output as JSON')
    .option('-v, --verbose', 'Verbose output')
    .action(async (file, options) => {
      try {
        await handleInfo(file, options);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`❌ Error: ${error.message}`);
        } else {
          console.error('❌ An unknown error occurred');
        }
        process.exit(1);
      }
    });

  program.parse();
}

main();
