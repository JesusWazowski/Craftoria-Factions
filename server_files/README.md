# Installing Craftoria

*** Java 21 or Java 25 is required ***

  The command "java -version" is a useful check.

0. Unarchive this zip

1. Run 'startserver.bat' (on Windows), or 'startserver.sh' (on Linux and macOS)

  The first time the script is run, it will download all files needed, and start a server.
	
  You will need to answer "true" to the standard Minecraft EULA question.
	
2. You should now have a working, local, server install.

  It can be uploaded to a hosting service.
	
  Details on on how to accomplish that, and configure server startup, depend accordingly on the specific hosting service.
	
* Some hosting services may provide for you to skip all of this and install prepared modpacks, including _Craftoria_, directly on their hosts.

## Craftoria Factions pregeneration queue

The optional `pregen-queue/craftoria_pregen_queue.js` is for the Craftoria
Factions world with seed `-2396434326660347612` and Distant Horizons 3.3.3.
On a planned server stop, place it in the server's `kubejs/server_scripts`
directory in place of the previous queue script, then start the server.
Packwiz does not deploy this script.

The queue starts automatically after 100 consecutive server ticks with no
players. A login requests a DH stop on the next server tick. When the server
is empty again, the queue restarts the unfinished DH task with the same
arguments so it can reuse generated data. DH may still have work in flight
while the stop takes effect.
An enabled queue resumes automatically after a server restart. An operator
pause or an error is saved with the world and requires `cfpregen resume` after
review.

Each pass runs in Full mode, centered at `0,0`. The order is Overworld, Nether,
Bumblezone, Twilight Forest, Eternal Starlight, Crystal Chronicles, Spectrum
Deeper Down, Spectrum Conservatory, then the End. The queue skips the known
mining, void, and utility dimensions and halts if it finds a new unclassified
dimension. The two passes are tracked separately from the previous 150-chunk
queue.

| DH radius (chunks) | Border width after all dimensions finish | Overworld bounds on each axis |
| --- | --- | --- |
| 250 | 8,000 blocks | −4,000 to +4,000 |
| 320 | 10,240 blocks | −5,120 to +5,120 |

The full border width is `2 × radius × 16`, centered at `0,0`. If the existing
border is already wider, the queue leaves it in place. Console commands are `cfpregen status`,
`cfpregen pause` to keep the queue paused, and `cfpregen resume` to re-enable
it. The queue waits for a separate DH task to finish before starting its own.
