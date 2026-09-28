import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const angularCli = resolve(projectRoot, 'node_modules', '@angular', 'cli', 'bin', 'ng.js');
const processes = [
  spawn(process.execPath, [angularCli, 'serve'], {
    cwd: projectRoot,
    stdio: 'inherit',
  }),
  spawn(process.execPath, ['tools/upload-server.mjs'], {
    cwd: projectRoot,
    stdio: 'inherit',
  }),
];

function stopProcesses() {
  for (const child of processes) {
    if (!child.killed) {
      child.kill();
    }
  }
}

for (const child of processes) {
  child.on('error', (error) => {
    console.error(error);
    stopProcesses();
    process.exitCode = 1;
  });
  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      stopProcesses();
      process.exitCode = code;
    }
  });
}

process.on('SIGINT', stopProcesses);
process.on('SIGTERM', stopProcesses);