const { exec } = require('child_process');

const PORT = 3000;

exec(`netstat -ano | findstr :${PORT}`, (err, stdout) => {
    if (err || !stdout) {
        console.log(`No process found on port ${PORT}`);
        return;
    }

    // Parse PID (last column)
    const lines = stdout.trim().split('\n');
    for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];

        if (pid && /^\d+$/.test(pid) && pid !== '0') {
            console.log(`Killing PID ${pid} on port ${PORT}`);
            exec(`taskkill /F /PID ${pid}`, (kErr, kOut) => {
                if (kErr) console.error(`Failed to kill ${pid}:`, kErr.message);
                else console.log(`Killed ${pid}`);
            });
        }
    }
});
