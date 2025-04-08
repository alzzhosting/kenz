import Redis from "ioredis";

// Koneksi ke Redis Upstash
const redis = new Redis({
    host: "relevant-caiman-61237.upstash.io",
    port: 6379,
    password: "Ae81AAIjcDE2YzQ3NWZkYmM4MjY0NzMyODM1MThiNDA4MTZmNWQ2MXAxMA",
    tls: {}
});

/**
 * Menambahkan jumlah request untuk setiap endpoint.
 * @param {string} endpoint - Nama endpoint yang dikunjungi
 */
export async function trackRequest(endpoint) {
    try {
        await redis.incr(`request_count:${endpoint}`);
        console.log(`Tracked request for: ${endpoint}`); // Debugging
    } catch (error) {
        console.error("Redis Error in trackRequest:", error);
    }
}

/**
 * Mengambil total request dari semua endpoint.
 * @returns {Object} - Daftar jumlah request untuk setiap endpoint
 */
export async function getAllRequestCounts() {
    try {
        let cursor = "0";
        let keys = [];
        do {
            const result = await redis.scan(cursor, "MATCH", "request_count:*", "COUNT", 100);
            cursor = result[0];
            keys.push(...result[1]);
        } while (cursor !== "0");

        const counts = {};
        for (const key of keys) {
            const endpoint = key.replace("request_count:", "");
            counts[endpoint] = parseInt(await redis.get(key), 10) || 0;
        }

        console.log("Fetched request counts:", counts); // Debugging
        return counts;
    } catch (error) {
        console.error("Redis Error in getAllRequestCounts:", error);
        return {};
    }
}

export default redis;
