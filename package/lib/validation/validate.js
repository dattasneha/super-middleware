import { z } from "zod";

/**
 * Middleware to validate request body against a Zod schema
 * @param {Object} schema - Zod schema object
 * @returns {Function} Express middleware function
 */

export function validate(schema) {
    const zObject = z.object(schema);

    return (req, res, next) => {
        try {
            // Parse the request body
            zObject.parse(req.body);
            // validation passed
            next();
        } catch (err) {
            if (err instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    errors: err.errors.map(e => e.message),
                });
            }
            next(err);
        }
    }

}

