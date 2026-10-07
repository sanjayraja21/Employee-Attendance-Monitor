const notFound = (req, res, next) => {
    res.status(404).json({
        message:
            `Route not found: ${req.originalUrl}`
    });
};


const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        message: "Internal server error",
        error: err.message
    });
};


module.exports = {
    notFound,
    errorHandler
};