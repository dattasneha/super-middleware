import crypto from 'crypto';

/**
 * ETag Middleware for Express
 * Generates an ETag header for GET responses based on the response body.
 * If the client sends an If-None-Match header with a matching ETag, returns 304 Not Modified.
 */
export function etagMiddleware(req, res, next) {
    // Only apply ETag to GET requests
    if (req.method !== 'GET') return next();

    // Keep reference to the original res.send function
    const oldSend = res.send.bind(res);

    // Override res.send
    res.send = (body) => {
        // If there is no body, just call original send
        if (!body) return oldSend(body);

        // Convert objects (like JSON) to a string for hashing
        let bodyStr = body;
        if (typeof body === 'object') {
            bodyStr = JSON.stringify(body);
        }

        // Generate MD5 hash of the response body
        const hash = crypto.createHash('md5').update(bodyStr).digest('hex');

        // Wrap the hash in quotes to follow HTTP ETag format
        const etagValue = `"${hash}"`;

        // Set the ETag header
        res.set('ETag', etagValue);

        // If the client sent If-None-Match and it matches the ETag, return 304
        if (req.headers['if-none-match'] === etagValue) {
            return res.status(304).end();
        }

        // Otherwise, send the original response
        return oldSend(body);
    };

    next();
}
