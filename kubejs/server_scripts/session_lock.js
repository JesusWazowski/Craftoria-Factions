// Priority: 5
// This script handles the global "Session Lock" using FTB Teams and FTB Chunks API

// command registration for /session lock /session unlock and /session info
ServerEvents.commandRegistry(event => {
    const { commands: Commands, arguments: Arguments } = event

    event.register(
        Commands.literal('session')
            .requires(s => s.hasPermission(2)) // Admin only
            .then(Commands.literal('lock')
                .executes(c => {
                    c.source.server.persistentData.putBoolean('sessionLocked', true)
                    c.source.sendSuccess('server has been restricted', true)
                    return 1
                })
            )
            .then(Commands.literal('unlock')
                .executes(c => {
                    c.source.server.persistentData.putBoolean('sessionLocked', false)
                    c.source.sendSuccess('server has been unrestricted', true)
                    return 1
                })
            )
            .then(Commands.literal('info') // display current session lock status with argument info or with no argument
                .executes(c => {
                    let status = c.source.server.persistentData.getBoolean('sessionLocked') ? 'restricted' : 'unrestricted'
                    c.source.sendSuccess('server is currently ' + status, true)
                    return 1
                })
            )
            .executes(c => {
                    let status = c.source.server.persistentData.getBoolean('sessionLocked') ? 'restricted' : 'unrestricted'
                    c.source.sendSuccess('server is currently ' + status, true)
                    return 1
                })
            )
})

