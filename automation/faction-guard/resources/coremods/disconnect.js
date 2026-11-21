function initializeCoreMod() {
  return {
    readableServiceDisconnect: {
      target: {
        type: 'METHOD',
        class: 'net.minecraft.client.gui.screens.DisconnectedScreen',
        methodName: '<init>',
        methodDesc: '(Lnet/minecraft/client/gui/screens/Screen;Lnet/minecraft/network/chat/Component;Lnet/minecraft/network/DisconnectionDetails;Lnet/minecraft/network/chat/Component;)V'
      },
      transformer: function(node) {
        var Opcodes = Java.type('org.objectweb.asm.Opcodes');
        var InsnList = Java.type('org.objectweb.asm.tree.InsnList');
        var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
        var MethodInsnNode = Java.type('org.objectweb.asm.tree.MethodInsnNode');
        var prefix = new InsnList();
        prefix.add(new VarInsnNode(Opcodes.ALOAD, 3));
        prefix.add(new MethodInsnNode(Opcodes.INVOKESTATIC,
          'craftoria/factions/client/DisconnectMessages', 'readable',
          '(Lnet/minecraft/network/DisconnectionDetails;)Lnet/minecraft/network/DisconnectionDetails;', false));
        prefix.add(new VarInsnNode(Opcodes.ASTORE, 3));
        node.instructions.insert(prefix);
        node.maxStack = Math.max(node.maxStack, 1);
        return node;
      }
    }
  };
}
