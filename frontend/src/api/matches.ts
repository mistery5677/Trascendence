export async function handleGameOver(
  playerAId:    number,
  playerBId:    number,
  matchResult:  string
) {
    try {
        const response = await fetch ('/api/matches/end', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                playerAId: playerAId,
                playerBId: playerBId,
                result: matchResult // PLAYER_A_WINS, PLAYER_B_WINS, DRAW
            })
        });

        if (response.ok){
            console.log("Match finished");
        }
    } catch (error){
        console.error("Failed to save the match");
    }
}