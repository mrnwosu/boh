#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const PDFParser = require('pdf2json');

/**
 * Parse PDF with column detection and single-column output
 */
function parsePDF(pdfPath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(pdfPath)) {
      reject(new Error(`PDF file not found: ${pdfPath}`));
      return;
    }

    const pdfParser = new PDFParser(null, 1);

    pdfParser.on('pdfParser_dataError', (error) => {
      reject(new Error(`PDF parsing error: ${error.message}`));
    });

    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      try {
        const content = extractTextFromPDF(pdfData);
        resolve({
          content,
          numPages: pdfData.Pages ? pdfData.Pages.length : 0,
        });
      } catch (error) {
        reject(error);
      }
    });

    pdfParser.loadPDF(pdfPath);
  });
}

/**
 * Extract and format text from PDF data
 * Detects multi-column layouts and merges them
 */
function extractTextFromPDF(pdfData) {
  if (!pdfData.Pages || pdfData.Pages.length === 0) {
    return '';
  }

  const allPages = pdfData.Pages.map((page, pageIndex) => {
    return formatPageSingleColumn(page, pageIndex);
  });

  return allPages.join('\n\n');
}

/**
 * Format a single page to single column
 * Detects multi-column layouts and reorders text properly
 */
function formatPageSingleColumn(page, pageIndex) {
  if (!page || !page.Texts || page.Texts.length === 0) {
    return '';
  }

  // Extract text items with their positions
  const textItems = page.Texts.map(textObj => {
    // x, y are normalized coordinates (0-100)
    let text = '';
    try {
      text = decodeURIComponent(textObj.R[0].T);
    } catch (e) {
      text = textObj.R[0].T;
    }
    return {
      text,
      x: textObj.x,
      y: textObj.y,
      width: textObj.w,
    };
  }).filter(item => item.text.trim().length > 0);

  if (textItems.length === 0) {
    return '';
  }

  // Detect columns by clustering x-coordinates
  const columns = detectColumns(textItems);

  // Sort items within each column (top to bottom)
  columns.forEach(column => {
    column.items.sort((a, b) => a.y - b.y);
  });

  // Merge columns left to right
  const mergedText = columns
    .map(col => col.items.map(item => item.text).join(' '))
    .join('\n');

  return mergedText;
}

/**
 * Detect columns in the page by clustering x-coordinates
 * Returns array of columns with their items
 */
function detectColumns(textItems) {
  if (textItems.length < 2) {
    return [{ items: textItems }];
  }

  // Get unique x-positions (rounded to nearest whole number for clustering)
  const xPositions = [...new Set(textItems.map(item => Math.round(item.x)))].sort((a, b) => a - b);

  // Simple clustering: group x-positions that are close together
  const columnClusters = [];
  let currentCluster = [xPositions[0]];

  for (let i = 1; i < xPositions.length; i++) {
    // If positions are within 5 units, consider them the same column
    if (xPositions[i] - xPositions[i - 1] < 5) {
      currentCluster.push(xPositions[i]);
    } else {
      columnClusters.push(currentCluster);
      currentCluster = [xPositions[i]];
    }
  }
  if (currentCluster.length > 0) {
    columnClusters.push(currentCluster);
  }

  // If we detected only 1 column, return all items in one column
  if (columnClusters.length === 1) {
    return [{ items: textItems }];
  }

  // Assign items to columns
  const columns = columnClusters.map(cluster => {
    const avgX = cluster.reduce((a, b) => a + b, 0) / cluster.length;
    return {
      x: avgX,
      items: textItems.filter(item => {
        const roundedX = Math.round(item.x);
        return cluster.includes(roundedX);
      }),
    };
  });

  // Sort columns by x-position (left to right)
  columns.sort((a, b) => a.x - b.x);

  return columns;
}

/**
 * Convert text to markdown format
 */
function convertToMarkdown(text) {
  let md = text;

  // Split into lines for processing
  const lines = md.split('\n');
  const processedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';

    // Skip empty lines initially
    if (!trimmed) {
      processedLines.push('');
      continue;
    }

    // Detect headers (short lines followed by dashes or lines in all caps)
    if (nextLine && /^-{3,}$|^={3,}$/.test(nextLine)) {
      processedLines.push(`## ${trimmed}`);
      i++; // Skip the dash/equals line
      continue;
    }

    // Detect all-caps headings (likely headers)
    if (trimmed.length < 80 && trimmed === trimmed.toUpperCase() && trimmed.length > 3) {
      processedLines.push(`## ${trimmed}`);
      continue;
    }

    // Detect section numbers (e.g., "I.", "1.", "A.")
    if (/^[IVXivx]+\.|^\d+\.|^[A-Z]\./.test(trimmed)) {
      processedLines.push(`### ${trimmed}`);
      continue;
    }

    // Add regular content
    processedLines.push(trimmed);
  }

  // Join and clean up
  let result = processedLines.join('\n');

  // Clean up multiple consecutive blank lines
  result = result.replace(/\n\n\n+/g, '\n\n');

  return result;
}

/**
 * Parse command
 */
async function handleParse(pdfPath, options) {
  const verbose = options.verbose || false;
  const format = options.format || 'text';

  if (verbose) console.error(`📄 Parsing PDF: ${pdfPath}`);

  const result = await parsePDF(pdfPath);

  let output = result.content;

  // Convert to markdown if requested
  if (format === 'markdown' || format === 'md') {
    output = convertToMarkdown(output);
  }

  if (options.output) {
    fs.writeFileSync(options.output, output, 'utf-8');
    if (verbose) console.error(`✓ Output saved to: ${options.output}`);
  } else {
    console.log(output);
  }

  if (verbose) console.error(`✓ Parsed ${result.numPages} pages`);
}

/**
 * Info command
 */
async function handleInfo(pdfPath, options) {
  const verbose = options.verbose || false;

  if (verbose) console.error(`📄 Analyzing PDF: ${pdfPath}`);

  const result = await parsePDF(pdfPath);

  const info = {
    file: pdfPath,
    pages: result.numPages,
    textLength: result.content.length,
  };

  if (options.json) {
    console.log(JSON.stringify(info, null, 2));
  } else {
    console.log(`\n📊 PDF Information:`);
    console.log(`   File: ${info.file}`);
    console.log(`   Pages: ${info.pages}`);
    console.log(`   Text Length: ${info.textLength} characters`);
    console.log();
  }
}

/**
 * Main CLI setup
 */
function main() {
  const program = new Command();

  program
    .name('pdf-parser')
    .description('Parse PDF files and extract text in single column format')
    .version('1.0.0');

  // Parse command
  program
    .command('parse <file>')
    .description('Parse PDF and output text in single column (auto-detects multi-column layouts)')
    .option('-o, --output <file>', 'Save output to file (default: stdout)')
    .option('-f, --format <format>', 'Output format: text (default) or markdown/md', 'text')
    .option('-v, --verbose', 'Verbose output')
    .action(async (file, options) => {
      try {
        await handleParse(file, options);
      } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
      }
    });

  // Info command
  program
    .command('info <file>')
    .description('Show PDF information')
    .option('-j, --json', 'Output as JSON')
    .option('-v, --verbose', 'Verbose output')
    .action(async (file, options) => {
      try {
        await handleInfo(file, options);
      } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
      }
    });

  program.parse();
}

main();
