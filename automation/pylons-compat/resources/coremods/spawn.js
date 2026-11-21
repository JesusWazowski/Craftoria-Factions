// Pinned to Pylons 5.4.2. Only bypass the spawn-area intersection veto.
function initializeCoreMod() {
  var Opcodes = Java.type('org.objectweb.asm.Opcodes');
  var InsnList = Java.type('org.objectweb.asm.tree.InsnList');
  var InsnNode = Java.type('org.objectweb.asm.tree.InsnNode');
  return {
    expulsionNearSpawn: {
      target: { type: 'METHOD', class: 'net.permutated.pylons.machines.expulsion.ExpulsionPylonTile',
        methodName: 'isAllowedLocation', methodDesc: '()Z' },
      transformer: function(node) {
        var matches = 0;
        Java.from(node.instructions.toArray()).forEach(function(instruction) {
          if (instruction.getOpcode() === Opcodes.INVOKEVIRTUAL
              && instruction.owner === 'net/minecraft/world/phys/AABB'
              && instruction.name === 'intersects'
              && instruction.desc === '(Lnet/minecraft/world/phys/AABB;)Z') {
            var replacement = new InsnList();
            replacement.add(new InsnNode(Opcodes.POP2));
            replacement.add(new InsnNode(Opcodes.ICONST_0));
            node.instructions.insertBefore(instruction, replacement);
            node.instructions.remove(instruction);
            matches++;
          }
        });
        if (matches !== 1) throw new Error('Expected one Pylons 5.4.2 spawn intersection, found ' + matches);
        return node;
      }
    }
  };
}
