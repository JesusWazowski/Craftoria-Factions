// Builds the faction milestone chapters from spec.cjs. Run from the repository root:
//   node automation/faction-milestones/generate.cjs          write chapters, lang, group and runtime config
//   node automation/faction-milestones/generate.cjs --check  fail if any generated file is out of date
// IDs are hashes of permanent spec keys, so regenerating never orphans quest progress.
const { createHash } = require('node:crypto');
const { readFileSync, writeFileSync, existsSync } = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '../..');
const quests = path.join(root, 'config/ftbquests/quests');
const files = {
  lang: path.join(quests, 'lang/en_us.snbt'),
  groups: path.join(quests, 'chapter_groups.snbt'),
  runtime: path.join(root, 'kubejs/config/faction_milestones.json'),
  tables: path.join(root, 'docs/faction-milestone-quests.md'),
  chapter: faction => path.join(quests, `chapters/milestones_${faction}.snbt`),
};
const TIERS = ['', 'I', 'II', 'III', 'IV'];

function hexId(...parts) {
  let digest = createHash('sha256').update('craftoria-faction-milestones:' + parts.join(':')).digest('hex').toUpperCase();
  // FTB IDs are positive longs; clearing the top bit keeps them in range.
  let id = (parseInt(digest[0], 16) & 7).toString(16).toUpperCase() + digest.slice(1, 16);
  if (/^0+$/.test(id)) throw new Error('Zero ID for ' + parts.join(':'));
  return id;
}

// Minimal SNBT writer. Typed wrappers keep FTB's numeric suffixes.
const D = value => ({ snbt: Number.isInteger(value) ? value.toFixed(1) + 'd' : value + 'd' });
const L = value => ({ snbt: value + 'L' });
const quote = text => '"' + String(text).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
function snbt(value, indent = '') {
  if (value && value.snbt !== undefined) return value.snbt;
  if (typeof value === 'string') return quote(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  let inner = indent + '\t';
  if (Array.isArray(value)) {
    if (!value.length) return '[ ]';
    if (value.every(entry => typeof entry === 'string')) return '[' + value.map(quote).join(', ') + ']';
    return '[\n' + value.map(entry => inner + snbt(entry, inner)).join('\n') + '\n' + indent + ']';
  }
  let keys = Object.keys(value).filter(key => value[key] !== undefined).sort();
  if (!keys.length) return '{ }';
  if (keys.every(key => typeof value[key] !== 'object' || value[key].snbt !== undefined) && keys.length <= 3 && indent.length > 2) {
    return '{ ' + keys.map(key => `${snbtKey(key)}: ${snbt(value[key], inner)}`).join(', ') + ' }';
  }
  return '{\n' + keys.map(key => `${inner}${snbtKey(key)}: ${snbt(value[key], inner)}`).join('\n') + '\n' + indent + '}';
}
const snbtKey = key => /^[A-Za-z0-9_.+-]+$/.test(key) ? key : quote(key);

function itemStack(id) { return { count: 1, id }; }

function buildTask(task, id) {
  let base = { id };
  if (task.icon) base.icon = { id: task.icon };
  switch (task.type) {
    case 'item':
      return Object.assign(base, {
        type: 'item',
        item: task.filter ? { components: { 'ftbfiltersystem:filter': task.filter }, count: 1, id: 'ftbfiltersystem:smart_filter' } : itemStack(task.id),
        count: task.count > 1 ? L(task.count) : undefined,
        consume_items: task.consume ? true : undefined,
      });
    case 'kill': return Object.assign(base, { type: 'kill', entity: task.entity, value: L(task.value) });
    case 'advancement': return Object.assign(base, { type: 'advancement', advancement: task.advancement, criterion: '' });
    case 'dimension': return Object.assign(base, { type: 'dimension', dimension: task.dimension });
    case 'structure': return Object.assign(base, { type: 'structure', structure: task.structure });
    case 'stat': return Object.assign(base, { type: 'stat', stat: task.stat, value: task.value });
    case 'custom': return Object.assign(base, { type: 'custom' });
    default: throw new Error('Unknown task type ' + task.type);
  }
}

function build(spec) {
  let groupId = hexId(spec.group.key);
  let lang = new Map([[`chapter_group.${groupId}.title`, spec.group.title]]);
  let chapters = new Map();
  let ids = new Set([groupId]);
  let runtime = { version: 1, baseClaims: spec.baseClaims, maxClaims: spec.maxClaims, factions: {}, rewards: {} };
  let claim = (id, owner) => {
    if (ids.has(id)) throw new Error('Duplicate generated ID ' + id + ' for ' + owner);
    ids.add(id);
    return id;
  };

  spec.factions.forEach((faction, order) => {
    let f = faction.id;
    let chapterId = claim(hexId(f, 'chapter'), f);
    let entries = [];
    let byKey = new Map();
    let add = (quest, extra) => {
      if (byKey.has(quest.key)) throw new Error(`Duplicate quest key ${f}:${quest.key}`);
      byKey.set(quest.key, Object.assign({ quest, id: claim(hexId(f, 'quest', quest.key), quest.key) }, extra));
      entries.push(byKey.get(quest.key));
    };
    let charter = { key: 'charter', title: `${faction.name} Charter`, icon: faction.icon, chunks: 0,
      tasks: [{ type: 'custom', kind: 'charter', title: `Belong to the ${faction.name}`, icon: faction.icon }],
      desc: [`&7Completed automatically for members of the ${faction.name}. Only your faction can see this chapter.`] };
    add(charter, { x: 0, y: 0, charter: true });
    faction.starters.forEach((quest, index) => add(quest, { x: index ? 1.75 : -1.75, y: 0, root: true }));
    let width = faction.pillars.length;
    let rows = 0;
    faction.pillars.forEach((pillar, column) => {
      pillar.quests.forEach((quest, row) => {
        add(quest, { x: (column - (width - 1) / 2) * 2.5, y: 2.5 + row * 1.5, root: !(quest.deps || []).length });
        rows = Math.max(rows, row + 1);
      });
    });
    add(Object.assign({ optional: true, chunks: 0 }, faction.cooperation), { x: ((width - 1) / 2) * 2.5 + 2.5, y: 0, root: true });
    add(Object.assign({ shape: 'hexagon', size: 2.0 }, faction.capstone), { x: 0, y: 2.5 + rows * 1.5 + 1.5 });

    let def = { name: faction.name, chapter: chapterId, charterQuest: null, charterTask: null, homeTask: null, quests: {}, total: 0 };
    let chapterQuests = entries.map(entry => {
      let { quest, id } = entry;
      let deps = entry.charter ? [] : entry.root ? [byKey.get('charter').id]
        : (quest.deps || []).map(key => {
          if (!byKey.has(key)) throw new Error(`Unknown dependency ${f}:${quest.key} -> ${key}`);
          return byKey.get(key).id;
        });
      if (!entry.charter && !entry.root && !deps.length) throw new Error(`Quest without dependencies ${f}:${quest.key}`);
      let tasks = quest.tasks.map((task, index) => {
        let taskId = claim(hexId(f, 'task', quest.key, index), quest.key);
        if (task.title) lang.set(`task.${taskId}.title`, task.title);
        if (task.type === 'custom') {
          if (task.kind === 'charter') def.charterTask = taskId;
          else if (task.kind === 'home') def.homeTask = taskId;
          else throw new Error('Unknown custom task ' + task.kind);
        }
        return buildTask(task, taskId);
      });
      let rewards = [];
      if (quest.chunks > 0) {
        let rewardId = claim(hexId(f, 'reward', quest.key), quest.key);
        rewards.push({ auto: 'enabled', icon: { id: 'minecraft:map' }, id: rewardId, team_reward: true, type: 'custom' });
        lang.set(`reward.${rewardId}.title`, `+${quest.chunks} Claimed Chunk${quest.chunks === 1 ? '' : 's'}`);
        def.quests[id] = quest.chunks;
        def.total += quest.chunks;
        runtime.rewards[rewardId] = { faction: f, quest: id, chunks: quest.chunks };
      }
      if (entry.charter) def.charterQuest = id;
      lang.set(`quest.${id}.title`, quest.title);
      let tier = quest.tier ? `Tier ${TIERS[quest.tier]} milestone` : quest.starter ? 'Starter milestone' : quest.optional ? 'Optional cooperation' : entry.charter ? '' : 'Capstone milestone';
      let reward = quest.chunks ? `: +${quest.chunks} claimed chunk${quest.chunks === 1 ? '' : 's'}` : '';
      if (quest.subtitle || tier) lang.set(`quest.${id}.quest_subtitle`, quest.subtitle || tier + reward);
      let desc = quest.desc.slice();
      if (tier && quest.subtitle) desc.push('', '&8' + tier + reward + '.');
      lang.set(`quest.${id}.quest_desc`, desc);
      return {
        dependencies: deps.length ? deps : undefined,
        hide_dependency_lines: entry.root ? true : undefined,
        hide_until_deps_complete: entry.root ? true : undefined,
        icon: quest.icon ? { id: quest.icon } : undefined,
        id,
        invisible: entry.charter ? true : undefined,
        optional: quest.optional ? true : undefined,
        rewards: rewards.length ? rewards : undefined,
        shape: quest.shape,
        size: D(quest.size || 1.0),
        tasks,
        x: D(entry.x),
        y: D(entry.y),
      };
    });
    if (def.total !== spec.maxClaims - spec.baseClaims) throw new Error(`${f} awards ${def.total} chunks; expected ${spec.maxClaims - spec.baseClaims}`);
    if (!def.charterTask || !def.homeTask) throw new Error(`${f} is missing its charter or home task`);
    lang.set(`chapter.${chapterId}.title`, faction.title);
    lang.set(`chapter.${chapterId}.chapter_subtitle`, [faction.subtitle]);
    runtime.factions[f] = def;
    chapters.set(f, '{\n' + Object.entries({
      default_hide_dependency_lines: false,
      default_quest_shape: '',
      filename: `milestones_${f}`,
      group: groupId,
      icon: { id: faction.icon },
      id: chapterId,
      images: [],
      order_index: order,
      quest_links: [],
      quests: chapterQuests,
    }).map(([key, value]) => `\t${key}: ${snbt(value, '\t')}`).join('\n') + '\n}\n');
  });
  runtime.generatedIds = Array.from(ids).sort();
  return { groupId, lang, chapters, runtime, ids };
}

// The lang file is FTB's sorted one-key-per-entry SNBT. Entries are replaced by key; stale generated keys are dropped.
function mergeLang(text, lang, previousIds) {
  let lines = text.replace(/\r\n/g, '\n').split('\n');
  if (lines[0] !== '{') throw new Error('Unexpected lang file header');
  let end = lines.lastIndexOf('}');
  let entries = [];
  for (let i = 1; i < end; i++) {
    let match = /^\t([A-Za-z_]+\.[0-9A-F]{16}\.[a-z_]+|[A-Za-z0-9_.]+): /.exec(lines[i]);
    if (!match) throw new Error('Unexpected lang line ' + (i + 1));
    let block = [lines[i]];
    if (lines[i].endsWith('[')) while (lines[++i] !== '\t]') block.push(lines[i]);
    if (block.length > 1) block.push('\t]');
    entries.push({ key: match[1], text: block.join('\n') });
  }
  let stale = key => previousIds.has(key.split('.')[1]);
  let kept = entries.filter(entry => !lang.has(entry.key) && !stale(entry.key));
  let render = (key, value) => Array.isArray(value)
    ? `\t${key}: [\n` + value.map(line => '\t\t' + quote(line)).join('\n') + '\n\t]'
    : `\t${key}: ${quote(value)}`;
  let added = Array.from(lang.entries()).map(([key, value]) => ({ key, text: render(key, value) }));
  // Merge without reordering existing keys, so the diff only shows milestone entries.
  let result = [];
  added.sort((a, b) => a.key < b.key ? -1 : 1);
  let j = 0;
  kept.forEach(entry => {
    while (j < added.length && added[j].key < entry.key) result.push(added[j++].text);
    result.push(entry.text);
  });
  while (j < added.length) result.push(added[j++].text);
  return ['{'].concat(result, ['}'], lines.slice(end + 1)).join('\n');
}

function mergeGroups(text, groupId) {
  if (text.includes(`"${groupId}"`)) return text;
  return text.replace('chapter_groups: [\n', `chapter_groups: [\n\t\t{ id: "${groupId}" }\n`);
}

function describeTask(task) {
  let count = task.count > 1 ? task.count.toLocaleString('en-US') + ' × ' : '';
  switch (task.type) {
    case 'item': return (task.consume ? 'hand in ' : '') + count + (task.title || '`' + task.id + '`');
    case 'kill': return (task.value > 1 ? task.value + ' × ' : '') + 'kill `' + task.entity + '`';
    case 'advancement': return 'advancement `' + task.advancement + '`';
    case 'dimension': return 'enter `' + task.dimension + '`';
    case 'structure': return 'find `' + task.structure + '`';
    case 'stat': return task.value + ' × stat `' + task.stat + '`';
    default: return task.title;
  }
}

// Review table for the owner; the narrative and rationale live in docs/faction-milestones.md.
function questTables(spec) {
  let lines = ['# Faction milestone quests', '',
    'Generated from `automation/faction-milestones/spec.cjs` by `generate.cjs`; do not edit by hand.',
    `Each faction starts at ${spec.baseClaims} claimable chunks and can earn ${spec.maxClaims - spec.baseClaims} more, up to ${spec.maxClaims}.`, ''];
  let tierName = quest => quest.starter ? 'Starter' : quest.tier ? 'T' + quest.tier : quest.optional ? 'Optional' : 'Capstone';
  spec.factions.forEach(faction => {
    lines.push(`## ${faction.name}`, '', '| Tier | Pillar | Quest | Chunks | After | Requirements |', '|---|---|---|---:|---|---|');
    let rows = faction.starters.map(quest => ['Starts', quest])
      .concat(...faction.pillars.map(pillar => pillar.quests.map(quest => [pillar.name, quest])),
        [['Capstone', faction.capstone], ['Cooperation', Object.assign({ optional: true }, faction.cooperation)]]);
    let order = quest => quest.starter ? 0 : quest.tier || (quest.optional ? 6 : 5);
    let titles = new Map(rows.map(([, quest]) => [quest.key, quest.title]));
    rows.sort((a, b) => order(a[1]) - order(b[1]));
    rows.forEach(([pillar, quest]) => lines.push(`| ${tierName(quest)} | ${pillar} | ${quest.title} | ${quest.chunks || 0} | `
      + `${(quest.deps || []).map(key => titles.get(key)).join(', ') || '—'} | ${quest.tasks.map(describeTask).join('; ').replace(/\|/g, '\\|')} |`));
    lines.push('');
  });
  return lines.join('\n');
}

function outputs() {
  delete require.cache[require.resolve('./spec.cjs')];
  let spec = require('./spec.cjs');
  let result = build(spec);
  let previous = existsSync(files.runtime) ? JSON.parse(readFileSync(files.runtime, 'utf8')).generatedIds || [] : [];
  let written = new Map();
  written.set(files.runtime, JSON.stringify(result.runtime, null, 2) + '\n');
  result.chapters.forEach((text, faction) => written.set(files.chapter(faction), text));
  written.set(files.lang, mergeLang(readFileSync(files.lang, 'utf8'), result.lang, new Set(previous)));
  written.set(files.groups, mergeGroups(readFileSync(files.groups, 'utf8').replace(/\r\n/g, '\n'), result.groupId));
  written.set(files.tables, questTables(spec));
  return { result, written };
}

if (require.main === module) {
  let { written } = outputs();
  let check = process.argv.includes('--check');
  let stale = [];
  written.forEach((text, file) => {
    let current = existsSync(file) ? readFileSync(file, 'utf8').replace(/\r\n/g, '\n') : null;
    if (current === text) return;
    if (check) stale.push(path.relative(root, file));
    else writeFileSync(file, text);
  });
  if (stale.length) {
    console.error('Out of date: ' + stale.join(', ') + '\nRun node automation/faction-milestones/generate.cjs');
    process.exit(1);
  }
  if (!check) console.log('Faction milestones generated.');
}

module.exports = { build, hexId, mergeLang, outputs, files };
