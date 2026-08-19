import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const portfolioRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const singularityRoot = resolve(process.env.SINGULARITY_ROOT ?? join(portfolioRoot, '..', 'singularity'));
const packages = [
  {
    source: resolve(process.env.WORKFLOW_ENGINE_PACKAGE_DIR ?? join(singularityRoot, 'libs', 'workflow-engine')),
    target: join(portfolioRoot, 'node_modules', '@singularity', 'workflow-engine'),
  },
  {
    source: resolve(process.env.LEAN_AGILE_MVP_PACKAGE_DIR ?? join(singularityRoot, 'libs', 'lean-agile-mvp', 'workflow')),
    target: join(portfolioRoot, 'node_modules', '@lean-agile-mvp', 'workflow'),
  },
];
const temporaryDirectory = mkdtempSync(join(tmpdir(), 'workflow-packages-'));

try {
  for (const packageDefinition of packages) {
    const tarballName = execFileSync(
      'npm',
      ['pack', '--pack-destination', temporaryDirectory],
      { cwd: packageDefinition.source, encoding: 'utf8' },
    ).trim().split('\n').at(-1);

    if (!tarballName?.endsWith('.tgz')) throw new Error(`${packageDefinition.source} did not produce a tarball`);
    if (!packageDefinition.target.startsWith(join(portfolioRoot, 'node_modules') + '/')) throw new Error('Refusing to install outside Portfolio node_modules');

    rmSync(packageDefinition.target, { recursive: true, force: true });
    mkdirSync(packageDefinition.target, { recursive: true });
    execFileSync('tar', [
      '-xzf', join(temporaryDirectory, tarballName),
      '--strip-components=1',
      '-C', packageDefinition.target,
    ]);
    console.log(`Installed ${tarballName} into ${packageDefinition.target}`);
  }
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
