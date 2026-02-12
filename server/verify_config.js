const WebSocket = require("ws");

const WS_URL = "ws://localhost:3000";

function createClient(name) {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(WS_URL);
        ws.on("open", () => resolve(ws));
        ws.on("error", reject);
    });
}

async function runTest() {
    console.log("Starting Config Verification Test...");

    try {
        const host = await createClient("HostConfig");

        // Create room with 2 questions
        const createMsg = {
            type: "create_room",
            name: "HostConfig",
            category: "sport",
            config: { questionCount: 2, questionDuration: 5 }
        };
        host.send(JSON.stringify(createMsg));

        let roomCode = null;
        let roundCount = 0;

        await new Promise((resolve, reject) => {
            host.on("message", async (data) => {
                const msg = JSON.parse(data);

                if (msg.type === "room_joined") {
                    console.log("Room created:", msg.code);
                    roomCode = msg.code;

                    if (msg.config.questionCount !== 2) {
                        reject(new Error("Question count mismatch in config"));
                    }

                    // Joiner
                    const joiner = await createClient("JoinerConfig");
                    joiner.send(JSON.stringify({ type: "join_room", name: "JoinerConfig", code: roomCode }));

                    // Auto answer for joiner to speed up
                    joiner.on("message", (jData) => {
                        const jMsg = JSON.parse(jData);
                        if (jMsg.type === "question") {
                            // Answer immediately
                            joiner.send(JSON.stringify({ type: "answer", choiceIndex: 0 }));
                        }
                    });
                }

                if (msg.type === "room_update") {
                    if (msg.players.length === 2 && msg.phase === "lobby") {
                        host.send(JSON.stringify({ type: "start_game" }));
                    }
                }

                if (msg.type === "question") {
                    roundCount++;
                    console.log("Round", roundCount, "started.");
                    // Host answers too
                    host.send(JSON.stringify({ type: "answer", choiceIndex: 0 }));
                }

                if (msg.type === "game_over") {
                    console.log("Game Over received.");
                    if (roundCount === 2) {
                        console.log("SUCCESS: Game ended after 2 rounds.");
                        resolve();
                    } else {
                        reject(new Error(`Game ended after ${roundCount} rounds, expected 2.`));
                    }
                }
            });

            setTimeout(() => reject(new Error("Test Timed Out")), 15000);
        });

        console.log("Test Passed!");
        process.exit(0);

    } catch (e) {
        console.error("Test failed:", e);
        process.exit(1);
    }
}

runTest();
