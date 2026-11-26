// PneumaticCraft 8.2.23: position can be queried by AStages during super().
function initializeCoreMod() {
  var O = Java.type('org.objectweb.asm.Opcodes');
  var InsnList = Java.type('org.objectweb.asm.tree.InsnList');
  var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
  var FieldInsnNode = Java.type('org.objectweb.asm.tree.FieldInsnNode');
  var JumpInsnNode = Java.type('org.objectweb.asm.tree.JumpInsnNode');
  var LabelNode = Java.type('org.objectweb.asm.tree.LabelNode');
  var MethodInsnNode = Java.type('org.objectweb.asm.tree.MethodInsnNode');
  var InsnNode = Java.type('org.objectweb.asm.tree.InsnNode');
  return {
    safeDroneConstruction: {
      target: { type: 'METHOD', class: 'me.desht.pneumaticcraft.common.util.fakeplayer.DroneFakePlayer',
        methodName: 'position', methodDesc: '()Lnet/minecraft/world/phys/Vec3;' },
      transformer: function(node) {
        var owner = 'me/desht/pneumaticcraft/common/util/fakeplayer/DroneFakePlayer';
        var droneType = 'Lme/desht/pneumaticcraft/common/drone/IDroneBase;';
        var original = Java.from(node.instructions.toArray()).filter(function(i) { return i.getOpcode() >= 0; });
        if (original.length !== 4 || original[0].getOpcode() !== O.ALOAD
            || original[0].var !== 0 || original[1].getOpcode() !== O.GETFIELD
            || original[1].owner !== owner || original[1].name !== 'drone'
            || original[1].desc !== droneType || original[2].getOpcode() !== O.INVOKEINTERFACE
            || original[2].owner !== 'me/desht/pneumaticcraft/common/drone/IDroneBase'
            || original[2].name !== 'getFakePlayerPos'
            || original[2].desc !== '()Lnet/minecraft/world/phys/Vec3;'
            || original[3].getOpcode() !== O.ARETURN) {
          throw new Error('Unexpected PneumaticCraft 8.2.23 DroneFakePlayer.position bytecode');
        }
        var ready = new LabelNode();
        var prefix = new InsnList();
        prefix.add(new VarInsnNode(O.ALOAD, 0));
        prefix.add(new FieldInsnNode(O.GETFIELD, owner, 'drone', droneType));
        prefix.add(new JumpInsnNode(O.IFNONNULL, ready));
        prefix.add(new VarInsnNode(O.ALOAD, 0));
        prefix.add(new MethodInsnNode(O.INVOKESPECIAL, 'net/neoforged/neoforge/common/util/FakePlayer',
          'position', '()Lnet/minecraft/world/phys/Vec3;', false));
        prefix.add(new InsnNode(O.ARETURN));
        prefix.add(ready);
        node.instructions.insert(prefix);
        return node;
      }
    }
  };
}
