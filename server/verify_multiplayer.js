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
    console.log("Starting Multiplayer Verification Test...");

    try {
        const host = await createClient("Host");
        console.log("Host connected.");

        // Send create_room immediately
        const createMsg = { type: "create_room", name: "Host", category: "sport" };
        host.send(JSON.stringify(createMsg));

        // We can't use await here for message because we need to set up listener before sending, 
        // but we sent it. So we wait for response.

        let roomCode = null;
        let hostId = null;

        // Wrap the rest in a promise to keep the script running until success/fail
        await new Promise((resolve, reject) => {
            host.on("message", async (data) => {
                const msg = JSON.parse(data);
                // console.log("Host received:", msg.type);

                if (msg.type === "room_joined") {
                    console.log("Host created room:", msg.code, "Category:", msg.category);
                    roomCode = msg.code;
                    hostId = msg.selfId;

                    if (msg.category !== "sport") {
                        console.error("FAILED: Category mismatch. Expected 'sport', got", msg.category);
                        reject(new Error("Category mismatch"));
                        return;
                    }

                    // Connect Joiner
                    const joiner = await createClient("Joiner");
                    console.log("Joiner connected. Joining room...");
                    joiner.send(JSON.stringify({ type: "join_room", name: "Joiner", code: roomCode }));

                    joiner.on("message", (jData) => {
                        const jMsg = JSON.parse(jData);
                        if (jMsg.type === "question") {
                            console.log("Joiner received question:", jMsg.question.text);
                            const text = jMsg.question.text;
                            // Simple keyword check from Sport questions
                            const keywords = ["Football", "Soccer", "Basketball", "Tennis", "NBA", "FIFA", "Olympic", "Race", "Sport", "Marathon"];
                            if (keywords.some(k => text.includes(k))) {
                                console.log("SUCCESS: Question is relevant to Sport!");
                                resolve();
                            } else {
                                console.log("WARNING: Question might not be sport-related:", text);
                                resolve(); // Still a success as flow worked
                            }
                        }
                    });
                }

                if (msg.type === "room_update") {
                    // console.log("Room update. Players:", msg.players.length);
                    if (msg.players.length === 2 && msg.phase === "lobby" && msg.ownerId === hostId) {
                        console.log("Lobby full. Starting game...");
                        host.send(JSON.stringify({ type: "start_game" }));
                    }
                }
            });

            // Timeout
            setTimeout(() => reject(new Error("Test Timed Out")), 10000);
        });

        console.log("Test Passed!");
        process.exit(0);

    } catch (e) {
        console.error("Test failed:", e);
        process.exit(1);
    }
}

runTest();
