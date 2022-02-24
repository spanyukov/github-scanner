
export const throttler = {
    storage: {},
    timeoutIds: [],

    getStorage() {
        return this.storage;
    },

    async getRecord(key) {
        return this.getStorage()[key] || []
    },

    async addRecord(key, ttl) {
        const ttlMilliseconds = ttl * 1000;
        if (!this.getStorage()[key]) {
            this.getStorage()[key] = [];
        }

        this.getStorage()[key].push(Date.now() + ttlMilliseconds);

        const timeoutId = setTimeout(() => {
            this.getStorage()[key].shift();
            clearTimeout(timeoutId);
        }, ttlMilliseconds);
        this.timeoutIds.push(timeoutId);
    },

    clearAllTimeouts() {
        this.timeoutIds.forEach(clearTimeout);
    },

    async handle(key, ttl, limit) {
        const ttls = await this.getRecord(key);
        const nearestExpiryTime = ttls.length > 0 ? Math.ceil((ttls[0] - Date.now()) / 1000) : 0;
        if (ttls.length >= limit) {
            throw new Error(`Retry after ${nearestExpiryTime} sec`);
        }
        await this.addRecord(key, ttl);

        return true;
    }
};

