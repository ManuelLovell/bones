import path from 'path'
import fs from 'fs'

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));
let appVersion = packageJson.version;

try
{
    const manifestJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'public/manifest.json'), 'utf-8'));
    if (manifestJson.version)
    {
        appVersion = String(manifestJson.version);
    }
}
catch (error)
{
    // Keep package.json version fallback when manifest is unavailable.
}

export default {
    server: { cors: true }, // Needed for new local dev
    define: {
        __APP_VERSION__: JSON.stringify(appVersion),
    },
    build: {
        target: 'esnext',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                dicecontroller: path.resolve(__dirname, 'dicecontroller.html'),
                dicewindow: path.resolve(__dirname, 'dicewindow.html'),
                dicenotify: path.resolve(__dirname, 'dicenotify.html'),
            }
        }
    }
}