#!/usr/bin/env node
/**
 * Fail when a skill names an mc_* / dbx_* tool that SETUP.md does not
 * recommend, or when skills/setup/SKILL.md drifts from SETUP.md.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ALIAS = /`(mc_[a-z_]+|dbx_[a-z_]+)`/g;
const RECOMMENDED_LINE = /^- .*\`(mc_[a-z_]+|dbx_[a-z_]+)\`/;

function recommendedAliases(markdown) {
  const found = new Set();
  for (const line of markdown.split("\n")) {
    const match = line.match(RECOMMENDED_LINE);
    if (match) {
      found.add(match[1]);
    }
  }
  return found;
}

function allAliases(markdown) {
  const found = new Set();
  for (const match of markdown.matchAll(ALIAS)) {
    found.add(match[1]);
  }
  return found;
}

function sorted(set) {
  return [...set].sort();
}

function missing(from, allowed) {
  return sorted(from).filter((name) => !allowed.has(name));
}

const setupPath = join(ROOT, "SETUP.md");
const setupSkillPath = join(ROOT, "skills", "setup", "SKILL.md");
const setup = readFileSync(setupPath, "utf8");
const setupSkill = readFileSync(setupSkillPath, "utf8");

const setupRecommended = recommendedAliases(setup);
const skillRecommended = recommendedAliases(setupSkill);

let failed = false;

const setupOnly = missing(setupRecommended, skillRecommended);
const skillOnly = missing(skillRecommended, setupRecommended);
if (setupOnly.length || skillOnly.length) {
  failed = true;
  console.error("Recommended lists differ between SETUP.md and skills/setup/SKILL.md");
  if (setupOnly.length) {
    console.error(`  in SETUP.md only: ${setupOnly.join(", ")}`);
  }
  if (skillOnly.length) {
    console.error(`  in skills/setup/SKILL.md only: ${skillOnly.join(", ")}`);
  }
}

const skillsDir = join(ROOT, "skills");
for (const name of readdirSync(skillsDir)) {
  if (name === "setup") {
    continue;
  }
  const skillFile = join(skillsDir, name, "SKILL.md");
  let body;
  try {
    body = readFileSync(skillFile, "utf8");
  } catch {
    continue;
  }
  const extras = missing(allAliases(body), setupRecommended);
  if (extras.length) {
    failed = true;
    console.error(`${name} names tools SETUP.md does not recommend: ${extras.join(", ")}`);
  }
}

if (!setupRecommended.size) {
  failed = true;
  console.error("SETUP.md has no recommended mc_* / dbx_* aliases");
}

if (failed) {
  process.exit(1);
}

console.log(
  `OK: ${setupRecommended.size} recommended tools; skill aliases match SETUP.md`
);
