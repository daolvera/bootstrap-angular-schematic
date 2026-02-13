#!/usr/bin/env node

/**
 * Build script for the schematic
 * This script compiles TypeScript and copies necessary files
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building @dao/bootstrap-angular-schematic...\n');

try {
  // Clean dist folder
  console.log('🧹 Cleaning dist folder...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Compile TypeScript
  console.log('📦 Compiling TypeScript...');
  execSync('tsc -p tsconfig.json', { stdio: 'inherit' });

  // Copy collection.json
  console.log('📋 Copying collection.json...');
  const srcCollectionPath = path.join('src', 'collection.json');
  const distCollectionPath = path.join('dist', 'collection.json');
  fs.copyFileSync(srcCollectionPath, distCollectionPath);

  // Copy schema files
  console.log('📋 Copying schema files...');
  const schemaPath = path.join('src', 'ng-add', 'schema.json');
  const distSchemaPath = path.join('dist', 'ng-add', 'schema.json');
  fs.mkdirSync(path.dirname(distSchemaPath), { recursive: true });
  fs.copyFileSync(schemaPath, distSchemaPath);

  // Copy template files directory
  console.log('📂 Copying template files...');
  const filesPath = path.join('src', 'ng-add', 'files');
  const distFilesPath = path.join('dist', 'ng-add', 'files');
  if (fs.existsSync(filesPath)) {
    copyRecursiveSync(filesPath, distFilesPath);
  }

  // Copy README and other docs
  console.log('📄 Copying documentation...');
  const docsToCopy = ['README.md', 'LICENSE', 'CHANGELOG.md'];
  docsToCopy.forEach(doc => {
    if (fs.existsSync(doc)) {
      fs.copyFileSync(doc, path.join('dist', doc));
    }
  });

  // Copy package.json to dist
  console.log('📦 Copying package.json...');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  // Remove dev scripts and dependencies
  delete packageJson.scripts;
  delete packageJson.devDependencies;
  // Update schematics path for dist
  packageJson.schematics = './collection.json';
  fs.writeFileSync(
    path.join('dist', 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  console.log('\n✅ Build completed successfully!\n');
  console.log('📦 Output: dist/');
  console.log('🚀 Ready to publish with: npm publish dist --access public\n');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}

/**
 * Recursively copy directory
 */
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    // Skip .spec.ts and .spec.js files
    if (!src.endsWith('.spec.ts') && !src.endsWith('.spec.js')) {
      fs.copyFileSync(src, dest);
    }
  }
}
