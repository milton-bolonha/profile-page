// Environment Variable Loader for Client-Side
// This script loads .env file and makes variables available to the browser

class EnvLoader {
    constructor() {
        this.vars = {};
        this.loaded = false;
    }

    async load() {
        try {
            const response = await fetch('.env');
            if (!response.ok) {
                console.warn('No .env file found, using empty environment');
                this.loaded = true;
                return;
            }
            
            const text = await response.text();
            const lines = text.split('\n');
            
            lines.forEach(line => {
                line = line.trim();
                if (line && !line.startsWith('#')) {
                    const [key, ...valueParts] = line.split('=');
                    if (key && valueParts.length > 0) {
                        this.vars[key.trim()] = valueParts.join('=').trim();
                    }
                }
            });
            
            this.loaded = true;
            console.log('Environment variables loaded:', Object.keys(this.vars));
        } catch (error) {
            console.error('Error loading .env file:', error);
            this.loaded = true;
        }
    }

    get(key, defaultValue = '') {
        return this.vars[key] || defaultValue;
    }

    has(key) {
        return key in this.vars;
    }
}

// Global instance
window.ENV = new EnvLoader();
