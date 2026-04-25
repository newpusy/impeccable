/**
 * Skill loader — handles reading, parsing, and caching skill files from disk
 */

const fs = require('fs');
const path = require('path');

const SKILLS_BASE_DIR = path.resolve(__dirname, '../../.agents/skills');
const SKILL_FILENAME = 'SKILL.md';

// Simple in-memory cache so we don't re-read files on every call
const _cache = new Map();

/**
 * Read the raw markdown content of a skill file.
 * @param {string} skillName - The directory name of the skill (e.g. 'debug')
 * @returns {string} Raw file contents
 */
function readSkillFile(skillName) {
  const filePath = path.join(SKILLS_BASE_DIR, skillName, SKILL_FILENAME);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Skill not found: ${skillName} (looked in ${filePath})`);
  }

  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Extract the front-matter block from a SKILL.md file.
 * Expects YAML-ish lines between the first pair of `---` delimiters.
 * Returns an empty object if no front-matter is present.
 * @param {string} content
 * @returns {Record<string, string>}
 */
function parseFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const meta = {};
  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      meta[key.trim()] = rest.join(':').trim();
    }
  }
  return meta;
}

/**
 * Extract the first `# Heading` from the markdown as the skill title.
 * Falls back to the skill directory name.
 * @param {string} content
 * @param {string} fallback
 * @returns {string}
 */
function extractTitle(content, fallback) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

/**
 * Extract all fenced code blocks (``` ... ```) from the markdown.
 * Returns an array of { lang, code } objects.
 * @param {string} content
 * @returns {Array<{ lang: string, code: string }>}
 */
function extractCodeBlocks(content) {
  const blocks = [];
  const regex = /```([\w]*)?\r?\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push({
      lang: match[1] || 'text',
      code: match[2].trimEnd(),
    });
  }
  return blocks;
}

/**
 * Load and fully parse a skill by name.
 * Results are cached after the first load.
 *
 * @param {string} skillName
 * @returns {{
 *   name: string,
 *   title: string,
 *   meta: Record<string, string>,
 *   codeBlocks: Array<{ lang: string, code: string }>,
 *   raw: string
 * }}
 */
function loadSkill(skillName) {
  if (_cache.has(skillName)) {
    return _cache.get(skillName);
  }

  const raw = readSkillFile(skillName);
  const meta = parseFrontMatter(raw);
  const title = extractTitle(raw, skillName);
  const codeBlocks = extractCodeBlocks(raw);

  const skill = { name: skillName, title, meta, codeBlocks, raw };
  _cache.set(skillName, skill);
  return skill;
}

/**
 * Bust the cache for a specific skill (or all skills if no name given).
 * Useful during development / watch mode.
 * @param {string} [skillName]
 */
function invalidateCache(skillName) {
  if (skillName) {
    _cache.delete(skillName);
  } else {
    _cache.clear();
  }
}

/**
 * List all skill directory names available on disk.
 * @returns {string[]}
 */
function listAvailableSkills() {
  return fs
    .readdirSync(SKILLS_BASE_DIR, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        fs.existsSync(path.join(SKILLS_BASE_DIR, entry.name, SKILL_FILENAME))
    )
    .map((entry) => entry.name);
}

module.exports = {
  loadSkill,
  listAvailableSkills,
  invalidateCache,
  // exported for unit testing
  _parseFrontMatter: parseFrontMatter,
  _extractTitle: extractTitle,
  _extractCodeBlocks: extractCodeBlocks,
};
