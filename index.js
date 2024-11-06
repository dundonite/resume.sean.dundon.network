import { promises as fs } from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import * as theme from 'jsonresume-theme-local';
import puppeteer from 'puppeteer';
import { render, validate } from 'resumed';
import { exec } from 'child_process';

// Paths
const RESUME_JSON_PATH = 'src/resume.json';
const OUTPUT_DIR = 'out';
const OUTPUT_RESUME_HTML = path.join(OUTPUT_DIR, 'index.html');
const OUTPUT_RESUME_PDF = path.join(OUTPUT_DIR, 'resume.pdf');
const OUTPUT_RESUME_DOCX = path.join(OUTPUT_DIR, 'resume.docx');
const OUTPUT_RESUME_JSON = path.join(OUTPUT_DIR, 'resume.json');

// JSON Validation
async function validateJson() {
  try {
    const isValid = await validate(RESUME_JSON_PATH);

    if (isValid) {
      console.log('JSON is valid.');
      return true;
    } else {
      console.error('JSON validation failed:', validate.errors);
    }
  } catch (err) {
    console.error('Error validating JSON:', err);
  }
  return false;
}

// Convert Image to Base64 WebP
async function convertImageToBase64Webp(imagePath) {
  try {
    const buffer = await sharp(imagePath).toFormat('webp').toBuffer();
    return `data:image/webp;base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.error('Error converting image to base64 WebP:', err);
    return null;
  }
}

// Copy and Modify JSON Function
async function copyAndModifyResumeJson() {
  try {
    const resume = JSON.parse(await fs.readFile(RESUME_JSON_PATH, 'utf-8'));

    // Check if basics.image is a local file path and convert it to base64 if valid
    if (resume.basics && resume.basics.image) {
      const imagePath = path.join('src', resume.basics.image);
      const imageExists = await fs.access(imagePath).then(() => true).catch(() => false);

      if (imageExists) {
        const base64Image = await convertImageToBase64Webp(imagePath);
        if (base64Image) {
          resume.basics.image = base64Image;
        }
      }
    }

    // Add the current date as lastModified
    resume.meta = resume.meta || {};
    resume.meta.properties = resume.meta.properties || {};
    resume.meta.properties.lastModified = new Date().toISOString();

    await fs.writeFile(OUTPUT_RESUME_JSON, JSON.stringify(resume, null, 2));
    console.log('resume.json copied and modified with lastModified date and base64 image (if applicable).');
  } catch (err) {
    console.error('Error modifying resume.json:', err);
  }
}

// HTML Generation
async function generateHtml() {
  try {
    const resume = JSON.parse(await fs.readFile(OUTPUT_RESUME_JSON, 'utf-8'));
    const html = await render(resume, theme);
    await fs.writeFile(OUTPUT_RESUME_HTML, html);
    console.log('HTML resume generated successfully.');
    return html;
  } catch (err) {
    console.error('Error generating HTML:', err);
  }
}

// PDF Generation
async function generatePdf(html) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: OUTPUT_RESUME_PDF, format: 'A4', printBackground: true });
  await browser.close();
  console.log('PDF resume generated successfully.');
}

// DOCX Generation
async function generateDocx() {
  return new Promise((resolve, reject) => {
    const args = `-f html -t docx --css=theme/pandoc.css -o ${OUTPUT_RESUME_DOCX}`;
    exec(`pandoc ${OUTPUT_RESUME_HTML} ${args}`, (err, stdout, stderr) => {
      if (err) {
        console.error('Error generating DOCX:', err);
        reject(err);
      } else {
        console.log('DOCX resume generated successfully.');
        resolve();
      }
    });
  });
}

// Main build function
async function buildResume() {
  try {
    await fs.access(RESUME_JSON_PATH);
  } catch (err) {
    console.error(`Error: ${RESUME_JSON_PATH} not found. Please make sure it is mounted and try again.`);
    process.exit(1);
  }

  const isJsonValid = await validateJson();
  if (!isJsonValid) {
    console.error('JSON validation failed. (Not) Halting build process. Make sure you have a valid resume at src/resume.json');
    // process.exit(1);
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await copyAndModifyResumeJson();
  const html = await generateHtml();
  await generatePdf(html);
  await generateDocx();
}

// Run the build process
buildResume().catch((error) => {
  console.error('Error building resume:', error);
});