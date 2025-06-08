import path from 'path'

export default {
    server: { cors: true }, // Needed for new local dev
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