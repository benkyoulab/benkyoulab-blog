import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const isWin = process.platform === 'win32';

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: isWin,
    env: process.env,
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (typeof result.status === 'number' && result.status !== 0) {
    process.exit(result.status);
  }
}

if (!isWin) {
  run('npx', ['next', 'build', '--webpack'], root);
  process.exit(0);
}

const tempBase = fs.mkdtempSync(path.join(os.tmpdir(), 'benkyoulab-build-'));
const tempRoot = path.join(tempBase, 'repo');

function shouldSkip(filePath) {
  const rel = path.relative(root, filePath).split(path.sep).join('/');
  return rel.startsWith('.git/') || rel === '.git' || rel.startsWith('.next/') || rel === '.next' || rel.startsWith('dist/') || rel === 'dist';
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);

    if (entry.isDirectory()) {
      if (shouldSkip(source)) continue;
      copyDir(source, target);
      continue;
    }

    if (entry.isSymbolicLink()) {
      continue;
    }

    if (shouldSkip(source)) continue;
    fs.copyFileSync(source, target);
  }
}

copyDir(root, tempRoot);

const nextBin = path.join(tempRoot, 'node_modules', '.bin', 'next.cmd');
const hasLocalNext = fs.existsSync(nextBin);

if (!hasLocalNext) {
  console.error('Next.js binary not found in temp build copy.');
  process.exit(1);
}

run('cmd.exe', ['/c', '"' + nextBin + '"', 'build', '--webpack'], tempRoot);
