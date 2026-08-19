import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const fixtures = join(root, 'docs/contracts/portfolio-workflow/v1/fixtures');
const allowedEventTypes = new Set([
  'workflow.step.started',
  'workflow.step.completed',
  'workflow.step.blocked',
  'workflow.step.resumed',
  'workflow.mvp.evidence-recorded',
  'workflow.macro.approved',
  'workflow.macro.replay-completed',
]);

function readJson(name) {
  return JSON.parse(readFileSync(join(fixtures, name), 'utf8'));
}

function listSourceFiles(directory) {
  try {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return listSourceFiles(path);
      return /\.(?:ts|mts|cts|js|mjs|cjs)$/.test(entry.name) ? [path] : [];
    });
  } catch {
    return [];
  }
}

export function verifyWorkflowContractFixtures() {
  const event = readJson('delegated-macro-approval.event.json');
  const macro = readJson('approved-workflow-macro.json');
  const recording = readJson('redacted-macro-recording.json');

  if (!allowedEventTypes.has(event.type)) throw new Error(`Unallowlisted event type: ${event.type}`);
  if (event.version !== 2 || event.actor?.kind !== 'service-account') throw new Error('Fixture must use a v2 Service Account actor');
  if (event.delegation?.kind !== 'on-behalf-of' || !event.delegation.principalId) throw new Error('Delegated fixture must retain its initiating principal');
  if (!event.source?.service || !event.source.serviceAccountId) throw new Error('Fixture must identify its trusted source');
  if (macro.status !== 'approved' || !macro.approvedBy || !macro.commands?.every((command) => command.executionTarget === 'disposable-workspace')) {
    throw new Error('Macro fixture must be approved and target a disposable workspace');
  }
  if (!recording.correlationId || recording.events?.length !== 1 || recording.events[0].redaction !== 'fields-removed' || 'authorization' in recording.events[0].payload) {
    throw new Error('Recording fixture must retain one correlation-scoped, redacted event');
  }

  const forbidden = /(?:@singularity\/|\/home\/dave\/dev\/projects\/singularity|agents\/|skills\/)/;
  const privateImports = ['apps', 'libs', 'tools']
    .flatMap((directory) => listSourceFiles(join(root, directory)))
    .filter((file) => file !== fileURLToPath(import.meta.url))
    .filter((file) => forbidden.test(readFileSync(file, 'utf8')));
  if (privateImports.length > 0) throw new Error(`Private Singularity import/content reference: ${privateImports.join(', ')}`);

  return { eventType: event.type, macroId: macro.macroId, recordingId: recording._id, sourceFilesChecked: listSourceFiles(join(root, 'apps')).length + listSourceFiles(join(root, 'libs')).length + listSourceFiles(join(root, 'tools')).length - 1 };
}

if (process.argv[1] && statSync(process.argv[1]).isFile() && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(verifyWorkflowContractFixtures()));
}
