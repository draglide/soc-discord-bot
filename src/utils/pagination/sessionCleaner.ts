import { paginationSessionMap } from "./paginationMap";

export function startSessionCleanupJob() {
    setInterval(() => {
        const now = Date.now();
        const expiredKeys: string[] = [];

        paginationSessionMap.forEach((session, key) => {
            if (now - session.timestamp > 5 * 60 * 1000) { // ⏱️ 5 minutes
                expiredKeys.push(key);
            }
        });

        expiredKeys.forEach(key => paginationSessionMap.delete(key));
        if (expiredKeys.length) console.log(`🧹 Cleaned up ${expiredKeys.length} expired sessions`);
    }, 60 * 1000); // run every minute
}