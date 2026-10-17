// Test-only script: copy to an isolated server, reload, run factionprobe from console.
ServerEvents.commandRegistry(event => {
  event.register(event.commands.literal('factionprobe').requires(source => source.hasPermission(4)).executes(context => {
    try {
    let server = context.source.server;
    factionParties.initialize(server);
    let team = factionParties.team(factionDefinitions.factions[0].id);
    let UUID = Java.loadClass('java.util.UUID');
    let Profile = Java.loadClass('com.mojang.authlib.GameProfile');
    let Factory = Java.loadClass('net.neoforged.neoforge.common.util.FakePlayerFactory');
    let List = Java.loadClass('java.util.ArrayList');
    let profile = new Profile(UUID.fromString('e5abce77-3538-486c-a4c9-a4c042c41020'), 'FactionProbe');
    let fake = Factory.get(server.overworld(), profile);
    let manager = factionParties.manager();
    manager.playerLoggedIn(null, profile.getId(), profile.getName());
    let existing = manager.getTeamForPlayerID(profile.getId()).orElse(null);
    if (existing && existing.isPartyTeam()) {
      FactionGuard.appointOwner(existing, context.source, new Profile(UUID.fromString(factionParties.system(existing)), 'Faction System'));
      FactionGuard.leaveAuthorized(existing, profile.getId());
    }
    let passed = [];
    let check = (label, fn) => { if (!fn()) throw new Error('FAILED: ' + label); passed.push(label); };
    let denied = fn => { try { fn(); return false; } catch (error) { return /Only operators|reserved faction membership/.test(String(error)); } };
    let system = UUID.fromString(factionParties.system(team));
    let systemProfile = new Profile(system, 'Faction System');
    let dispatcher = server.getCommands().getDispatcher();
    for (let name of ['join', 'assign']) {
      let suggestions = dispatcher.getCompletionSuggestions(dispatcher.parse('faction ' + name + ' me', context.source)).join().getList();
      let values = []; suggestions.forEach(suggestion => values.push(String(suggestion.getText())));
      check('native ' + name + ' completion', () => values.length === 1 && values[0] === 'mechanists');
    }
    check('legacy home root removed', () => dispatcher.getRoot().getChild('factionhome') === null);
    check('old faction commands removed', () => dispatcher.getRoot().getChild('faction').getChild('home') === null && dispatcher.getRoot().getChild('faction').getChild('owner') === null);
    check('home info registered', () => dispatcher.getRoot().getChild('home').getCommand() !== null);
    check('personal home commands disabled', () => dispatcher.getRoot().getChild('delhome') === null && dispatcher.getRoot().getChild('listhomes') === null);
    let homeInput = 'sethome ' + factionParties.team('mechanists').getShortName();
    let homeContext = dispatcher.parse(homeInput, context.source).getContext().build(homeInput);
    check('native home target resolves another party', () => String(SessionTeamArgument.get(homeContext, 'party').getId()) === String(factionParties.team('mechanists').getId()));
    let homeSuggestions = dispatcher.getCompletionSuggestions(dispatcher.parse('sethome ' + String(factionParties.team('mechanists').getShortName()).slice(0, 2), context.source)).join().getList();
    check('native home party completion', () => homeSuggestions.size() > 0);
    let deniedHome = dispatcher.parse(homeInput, context.source.withPermission(0));
    check('native nonoperator home target denied', () => deniedHome.getReader().canRead());
    check('four parties', () => factionDefinitions.factions.every(f => !!factionParties.team(f.id)));
    check('native create denied', () => denied(() => manager.createPartyTeam(fake, 'Denied', '', null)));
    check('system leave denied', () => denied(() => team.leave(system)));
    let profiles = new List(); profiles.add(systemProfile);
    check('system kick denied', () => denied(() => team.kick(context.source, profiles)));
    check('system promote denied', () => denied(() => team.promote(fake, profiles)));
    check('system demote denied', () => denied(() => team.demote(fake, profiles)));
    team.addMember(profile.getId(), FactionRank.INVITED); team.join(null, profile);
    server.getProfileCache().add(profile);
    let ownershipCommand = 'ftbteams party transfer_ownership_for ' + team.getShortName() + ' ' + profile.getName();
    dispatcher.execute(ownershipCommand, context.source);
    check('console owner appointment', () => team.isOwner(profile.getId()));
    check('native owner transfer denied', () => denied(() => FactionGuard.appointOwner(team, fake.createCommandSourceStack(), systemProfile)));
    check('native nonoperator ownership command denied', () => dispatcher.parse(ownershipCommand, fake.createCommandSourceStack()).getReader().canRead());
    let OpEntry = Java.loadClass('net.minecraft.server.players.ServerOpListEntry');
    server.getPlayerList().getOps().add(new OpEntry(profile, 2, false));
    try {
      dispatcher.execute(ownershipCommand, fake.createCommandSourceStack());
      check('native operator owner appointment', () => team.isOwner(profile.getId()));
      let outsider = new Profile(UUID.fromString('c17ba229-a2b8-4d2c-8721-27fa6d35a2d0'), 'Outsider');
      server.getProfileCache().add(outsider);
      let rejected = false;
      try { dispatcher.execute('ftbteams party transfer_ownership_for ' + team.getShortName() + ' ' + outsider.getName(), context.source); }
      catch (error) { rejected = /not a member/.test(String(error)); }
      check('native nonmember owner rejected', () => rejected && team.isOwner(profile.getId()));
      for (let name of ['spawn', 'back']) {
        check('native operator ' + name + ' permission', () => dispatcher.getRoot().getChild(name).canUse(fake.createCommandSourceStack()));
      }
    } finally { server.getPlayerList().getOps().remove(profile); }
    for (let name of ['spawn', 'back']) {
      check('native nonoperator ' + name + ' denied', () => !dispatcher.getRoot().getChild(name).canUse(fake.createCommandSourceStack()));
    }
    let state = factionParties.state();
    state.putBoolean('craftoriaFactionsManaged', false);
    try {
      factionParties.permissions();
      for (let name of ['spawn', 'back']) {
        check('existing world nonoperator ' + name + ' denied', () => !dispatcher.getRoot().getChild(name).canUse(fake.createCommandSourceStack()));
      }
      server.getPlayerList().getOps().add(new OpEntry(profile, 2, false));
      try {
        for (let name of ['spawn', 'back']) {
          check('existing world operator ' + name + ' allowed', () => dispatcher.getRoot().getChild(name).canUse(fake.createCommandSourceStack()));
        }
      } finally { server.getPlayerList().getOps().remove(profile); }
    } finally { state.putBoolean('craftoriaFactionsManaged', true); }
    check('native disband denied', () => denied(() => team.forceDisband(fake.createCommandSourceStack())));
    let QuestFile = Java.loadClass('dev.ftb.mods.ftbquests.quest.ServerQuestFile');
    let Chapter = Java.loadClass('dev.ftb.mods.ftbquests.quest.Chapter');
    let Quest = Java.loadClass('dev.ftb.mods.ftbquests.quest.Quest');
    let Task = Java.loadClass('dev.ftb.mods.ftbquests.quest.task.ItemTask');
    let Reward = Java.loadClass('dev.ftb.mods.ftbquests.quest.reward.ItemReward');
    let Data = Java.loadClass('dev.ftb.mods.ftbquests.quest.TeamData');
    let file = QuestFile.INSTANCE;
    let chapter = new Chapter(90000001, file, file.getDefaultChapterGroup());
    let quest = new Quest(90000002, chapter);
    quest.addTask(new Task(90000003, quest).setStackAndCount(Item.of('ftbquests:book'), 1));
    let reward = new Reward(90000004, quest, Item.of('minecraft:diamond'));
    let questData = new Data(team.getId(), file);
    let original = factionQuestRewards.modStages.ftbquests;
    factionQuestRewards.modStages.ftbquests = 'ritualists';
    factionQuestRewards.clear();
    try {
      check('forbidden native reward result denied', () => !questData.markRewardAsClaimed(profile.getId(), reward, 1));
      check('forfeited reward recorded claimed', () => questData.isRewardClaimed(profile.getId(), reward));
      let restored = new Data(team.getId(), file);
      restored.deserializeNBT(questData.serializeNBT());
      check('forfeiture survives native save/load', () => restored.isRewardClaimed(profile.getId(), reward));
      factionQuestRewards.modStages.ftbquests = 'stargazers'; factionQuestRewards.clear();
      check('forfeiture survives later access', () => !questData.markRewardAsClaimed(profile.getId(), reward, 2));
      let allowedReward = new Reward(90000005, quest, Item.of('minecraft:diamond'));
      check('eligible native reward allowed', () => questData.markRewardAsClaimed(profile.getId(), allowedReward, 3));
      factionQuestRewards.modStages.ftbquests = 'ritualists'; factionQuestRewards.clear();
      let suppressedReward = new Reward(90000006, quest, Item.of('minecraft:diamond'));
      questData.claimReward(fake, suppressedReward, false, 4);
      check('native claim suppressed delivery', () => questData.isRewardClaimed(profile.getId(), suppressedReward) && fake.getInventory().getItem(0).isEmpty());
    } finally {
      if (original === undefined) delete factionQuestRewards.modStages.ftbquests;
      else factionQuestRewards.modStages.ftbquests = original;
      factionQuestRewards.clear();
    }
    FactionGuard.appointOwner(team, context.source, systemProfile);
    FactionGuard.leaveAuthorized(team, profile.getId());
    check('empty faction persists' , () => factionParties.humanMembers(team) === 0 && team.getMembers().size() === 1);
    manager.saveNow();
    context.source.sendSuccess(Text.of('Faction probe passed: ' + passed.join(', ')), false);
    return passed.length;
    } catch (error) { console.error(String(error)); context.source.sendFailure(Text.of(String(error))); return 0; }
  }));
});
