#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import https from 'https';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SWAGGER_URLS = {
  spenicle: 'https://spenicle-api.dimasbaguspm.com/swagger/json',
  hi: 'https://hi.dimasbaguspm.com/swagger/json',
};

const OUTPUT_DIR = path.resolve(
  __dirname,
  '../packages/hooks/src/use-api/types',
);

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function fetchSwagger(
  url: string,
  dest: string,
  cb: (err?: Error | null) => void,
) {
  const file = fs.createWriteStream(dest);
  https
    .get(url, (response) => {
      if (response.statusCode !== 200) {
        cb(new Error(`Failed to fetch: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(cb);
      });
    })
    .on('error', (err) => {
      fs.unlink(dest, () => cb(err));
    });
}

function generateTypes(jsonPath: string, outPath: string) {
  execSync(`npx openapi-typescript ${jsonPath} -o ${outPath}`, {
    stdio: 'inherit',
  });
}

function generateTypesFromUrl(name: string, url: string) {
  return new Promise<void>((resolve, reject) => {
    const tempJsonPath = path.join(OUTPUT_DIR, `temp-${name}.json`);
    const typesOutPath = path.join(OUTPUT_DIR, `${name}.openapi.ts`);

    fetchSwagger(url, tempJsonPath, (err) => {
      if (err) {
        console.error(`Failed to fetch ${name} swagger:`, err);
        reject(err);
        return;
      }

      try {
        generateTypes(tempJsonPath, typesOutPath);
        execSync(`npx prettier --write ${typesOutPath}`, { stdio: 'inherit' });

        // Clean up temporary JSON file
        fs.unlinkSync(tempJsonPath);

        console.log(`✅ Generated ${name}.openapi.ts`);
        resolve();
      } catch (error) {
        console.error(`Failed to generate types for ${name}:`, error);
        // Clean up temporary JSON file on error
        if (fs.existsSync(tempJsonPath)) {
          fs.unlinkSync(tempJsonPath);
        }
        reject(error);
      }
    });
  });
}

// Generate types for both APIs
async function generateAllTypes() {
  try {
    const promises = Object.entries(SWAGGER_URLS).map(([name, url]) =>
      generateTypesFromUrl(name, url),
    );

    await Promise.all(promises);
    console.log('🎉 All OpenAPI types generated successfully!');
  } catch (error) {
    console.error('❌ Failed to generate OpenAPI types:', error);
    process.exit(1);
  }
}

generateAllTypes();
