export function errorHandler(err, req, res, next) {
    console.error(`[${req.method} ${req.originalUrl}]`, err.stack || err.message);

    const status = err.status || 500;
    res.status(status)
        .json({
            status: 'error',
            message: err.message || 'Internal server error',
        });
}