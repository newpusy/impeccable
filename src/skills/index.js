/**
 * Skills Registry
 * Central module for discovering and loading agent skills.
 * Each skill is lazily loaded on first access to keep startup fast.
 */

const path = require('path');
const fs = require('fs');

const SKILLS_DIR = path.resolve(__dirname, '../../.agents/skills');

/**
 * Discover all available skills by scanning the skills directory.
 * @returns {string[]} List of skill names
 */
function discoverSkills() {
  if (!fs.existsSync(SKILLS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

/**
 * Load the SKILL.md manifest for a given skill.
 * @param {string} skillName
 * @returns {{ name: string, path: string, manifest: string } | null}
 */
function loadSkill(skillName) {
  const skillPath = path.join(SKILLS_DIR, skillName);
  const manifestPath = path.join(skillPath, 'SKILL.md');

  if (!fs.existsSync(manifestPath)) {
    console.warn(`[skills] Skill "${skillName}" is missing a SKILL.md manifest.`);
    return null;
  }

  const manifest = fs.readFileSync(manifestPath, 'utf8');

  return {
    name: skillName,
    path: skillPath,
    manifest,
  };
}

/**
 * Parse a basic set of metadata from a SKILL.md file.
 * Looks for a top-level heading and an optional description paragraph.
 * @param {string} markdown
 * @returns {{ title: string, description: string }}
 */
function parseSkillMetadata(markdown) {
  const lines = markdown.split('\n');
  const titleLine = lines.find((l) => l.startsWith('# '));
  const title = titleLine ? titleLine.replace(/^#\s+/, '').trim() : 'Unknown Skill';

  // First non-empty, non-heading line after the title
  const titleIndex = titleLine ? lines.indexOf(titleLine) : -1;
  let description = '';
  for (let i = titleIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith('#')) {
      description = line;
      break;
    }
  }

  return { title, description };
}

/**
 * Build a registry of all skills with their parsed metadata.
 * @returns {Map<string, { name: string, title: string, description: string, path: string }>}
 */
function buildRegistry() {
  const registry = new Map();

  for (const skillName of discoverSkills()) {
    const skill = loadSkill(skillName);
    if (!skill) continue;

    const { title, description } = parseSkillMetadata(skill.manifest);
    registry.set(skillName, {
      name: skillName,
      title,
      description,
      path: skill.path,
    });
  }

  return registry;
}

// Singleton registry — built once on first import
let _registry = null;

/**
 * Get the skills registry (singleton).
 * @returns {Map<string, object>}
 */
function getRegistry() {
  if (!_registry) {
    _registry = buildRegistry();
  }
  return _registry;
}

/**
 * List all registered skills as an array.
 * @returns {object[]}
 */
function listSkills() {
  return Array.from(getRegistry().values());
}

/**
 * Get a single skill by name.
 * @param {string} name
 * @returns {object | undefined}
 */
function getSkill(name) {
  return getRegistry().get(name);
}

module.exports = {
  discoverSkills,
  loadSkill,
  parseSkillMetadata,
  buildRegistry,
  getRegistry,
  listSkills,
  getSkill,
};
