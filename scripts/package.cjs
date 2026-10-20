const {packager} = require('@electron/packager');
const path = require('node:path');
const fs = require('node:fs/promises');
const os = require('node:os');
const manifest = require('../package.json');

(async () => {
  const root = path.resolve(__dirname, '..');
  const staging = await fs.mkdtemp(path.join(os.tmpdir(), 'plataforma-package-'));
  try {
    // Package only the runtime. Tests, source, credentials and profiles stay out.
    for (const file of ['main.cjs', 'store.cjs', 'central-store.cjs', 'essay-service.cjs', 'radar.cjs', 'cloud-auth.cjs', 'cloud-defaults.json', 'cloud-sync.cjs', 'icon.ico', 'icon.png']) {
      await fs.copyFile(path.join(root, file), path.join(staging, file));
    }
    await fs.cp(path.join(root, 'renderer'), path.join(staging, 'renderer'), {recursive: true});
    await fs.writeFile(path.join(staging, 'package.json'), JSON.stringify({
      name: manifest.name, version: manifest.version, main: manifest.main,
      description: manifest.description, author: manifest.author, license: manifest.license,
    }, null, 2));
    const paths = await packager({
      dir: staging, out: path.join(root, 'dist'), name: 'PEP',
      executableName: 'PEP', platform: 'win32', arch: 'x64',
      electronVersion: manifest.devDependencies.electron,
      icon: path.join(root, 'icon.ico'), asar: true, prune: false, overwrite: false,
      appVersion: manifest.version, buildVersion: manifest.version,
      win32metadata: {FileDescription: 'PEP - Plataforma de Estudos', ProductName: 'PEP'},
    });
    console.log(paths.join('\n'));
  } finally {
    const resolved = path.resolve(staging);
    const temporaryRoot = path.resolve(os.tmpdir()) + path.sep;
    if (!resolved.startsWith(temporaryRoot) || !path.basename(resolved).startsWith('plataforma-package-')) {
      throw new Error('Pasta temporária fora do local esperado.');
    }
    await fs.rm(resolved, {recursive: true, force: true});
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
