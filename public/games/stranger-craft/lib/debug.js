// debug.js - Sistema simples de logging
export const Logger = {
    info: (msg, ...args) => console.log(`%c[INFO] ${msg}`, 'color: cyan', ...args),
    warn: (msg, ...args) => console.warn(`%c[WARN] ${msg}`, 'color: yellow', ...args),
    error: (msg, ...args) => console.error(`%c[ERROR] ${msg}`, 'color: red', ...args),
    debug: (msg, ...args) => console.debug(`%c[DEBUG] ${msg}`, 'color: gray', ...args)
};
