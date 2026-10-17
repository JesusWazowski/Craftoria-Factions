// Original guard code; does not replace or redistribute FTB classes.
function initializeCoreMod() {
  var Opcodes = Java.type('org.objectweb.asm.Opcodes');
  var InsnList = Java.type('org.objectweb.asm.tree.InsnList');
  var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
  var MethodInsnNode = Java.type('org.objectweb.asm.tree.MethodInsnNode');
  var party = 'dev.ftb.mods.ftbteams.data.PartyTeam';
  var source = 'Lnet/minecraft/commands/CommandSourceStack;';
  var profile = 'Lcom/mojang/authlib/GameProfile;';
  var player = 'Lnet/minecraft/server/level/ServerPlayer;';
  var team = 'Ldev/ftb/mods/ftbteams/data/PartyTeam;';
  var collection = 'Ljava/util/Collection;';
  var uuid = 'Ljava/util/UUID;';
  function hook(owner, method, desc, helper, helperDesc, args) {
    return {
      target: { type: 'METHOD', class: owner, methodName: method, methodDesc: desc },
      transformer: function(node) {
        var prefix = new InsnList();
        args.forEach(function(arg) { prefix.add(new VarInsnNode(Opcodes.ALOAD, arg)); });
        prefix.add(new MethodInsnNode(Opcodes.INVOKESTATIC, 'craftoria/factions/FactionGuard', helper, helperDesc, false));
        node.instructions.insert(prefix);
        node.maxStack = Math.max(node.maxStack, args.length);
        return node;
      }
    };
  }
  return {
    questReward: {
      target: { type: 'METHOD', class: 'dev.ftb.mods.ftbquests.quest.TeamData', methodName: 'markRewardAsClaimed',
        methodDesc: '(' + uuid + 'Ldev/ftb/mods/ftbquests/quest/reward/Reward;J)Z' },
      transformer: function(node) {
        var instructions = Java.from(node.instructions.toArray());
        instructions.forEach(function(instruction) {
          if (instruction.getOpcode() === Opcodes.IRETURN) {
            var check = new InsnList();
            check.add(new VarInsnNode(Opcodes.ALOAD, 0));
            check.add(new VarInsnNode(Opcodes.ALOAD, 1));
            check.add(new VarInsnNode(Opcodes.ALOAD, 2));
            check.add(new MethodInsnNode(Opcodes.INVOKESTATIC, 'craftoria/factions/FactionGuard', 'rewardResult',
              '(ZLdev/ftb/mods/ftbquests/quest/TeamData;' + uuid + 'Ldev/ftb/mods/ftbquests/quest/reward/Reward;)Z', false));
            node.instructions.insertBefore(instruction, check);
          }
        });
        node.maxStack = Math.max(node.maxStack, 4);
        return node;
      }
    },
    create: hook('dev.ftb.mods.ftbteams.data.TeamManagerImpl', 'createPartyTeam', '(' + player + 'Ljava/lang/String;Ljava/lang/String;Ldev/ftb/mods/ftblibrary/icon/Color4I;)Ldev/ftb/mods/ftbteams/api/Team;', 'create', '(' + player + ')V', [1]),
    leave: hook(party, 'leave', '(' + uuid + ')I', 'leave', '(' + team + uuid + ')V', [0, 1]),
    join: hook(party, 'join', '(' + player + profile + ')I', 'join', '(' + team + player + profile + ')V', [0, 1, 2]),
    transfer: hook(party, 'transferOwnership', '(' + source + profile + ')I', 'transfer', '(' + team + source + profile + ')V', [0, 1, 2]),
    disband: hook(party, 'forceDisband', '(' + source + ')I', 'disband', '(' + source + ')V', [1]),
    kick: hook(party, 'kick', '(' + source + collection + ')I', 'protect', '(' + team + collection + ')V', [0, 2]),
    promote: hook(party, 'promote', '(' + player + collection + ')I', 'protect', '(' + team + collection + ')V', [0, 2]),
    demote: hook(party, 'demote', '(' + player + collection + ')I', 'protect', '(' + team + collection + ')V', [0, 2])
  };
}
