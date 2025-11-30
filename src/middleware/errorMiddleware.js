const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    const status = err.statusCode || 500;
    const message = err.message || 'Error del servidor';
    res.status(status).json({
        success: false,
        message: message,
        stack: err.stack
    });
};

module.exports = errorMiddleware;