const errorController = {};

errorController.triggerError = async (req, res, next) => {
    try {
        // Intentionally throwing an error to generate a 500-type error
        throw new Error('Oh no! Try a different route!');
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

module.exports = errorController;