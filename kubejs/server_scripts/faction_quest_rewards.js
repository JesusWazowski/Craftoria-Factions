// priority: 4
// Quest progress remains shared; inaccessible reward claims are consumed without delivery.
const FactionItemTask = Java.loadClass('dev.ftb.mods.ftbquests.quest.task.ItemTask');
const factionQuestRewards = {
  cache: new Map(),
  warned: new Set(),
  modStages: (() => {
    let result = Object.create(null);
    Object.keys(factionDefinitions.restrictions).forEach(stage => {
      factionDefinitions.restrictions[stage].forEach(mod => { result[mod] = stage; });
    });
    return result;
  })(),
  clear() { this.cache.clear(); this.warned.clear(); },
  requirements(quest) {
    let id = String(quest.getId());
    if (this.cache.has(id)) return this.cache.get(id);
    let tasks = [];
    quest.getTasks().forEach(task => {
      if (!(task instanceof FactionItemTask)) return;
      let choices = new Set();
      task.getValidDisplayItems().forEach(stack => {
        if (!stack.isEmpty()) choices.add(String(stack.id).split(':')[0]);
      });
      // FTB can fall back to the filter token when an adapter cannot enumerate it.
      if (!choices.size || choices.has('ftbfiltersystem')) {
        if (!this.warned.has(id)) {
          console.warn('[Faction quests] Unresolved item filter in quest ' + id + '; this task is unrestricted');
          this.warned.add(id);
        }
        return;
      }
      tasks.push(Array.from(choices).map(mod => this.modStages[mod] || ''));
    });
    this.cache.set(id, tasks);
    return tasks;
  },
  allowed(uuid, reward) {
    if (!factionParties.active()) return true;
    let team = factionParties.manager().getTeamForPlayerID(uuid).orElse(null);
    let faction = factionParties.faction(team);
    let stages = faction ? [faction.id].concat(faction.sharedGroups) : [];
    return this.requirements(reward.getQuest()).every(options => options.some(stage => !stage || stages.includes(stage)));
  },
};
FactionGuard.setRewardValidator((uuid, reward) => factionQuestRewards.allowed(uuid, reward));
FactionGuard.setQuestCacheListener(() => factionQuestRewards.clear());
