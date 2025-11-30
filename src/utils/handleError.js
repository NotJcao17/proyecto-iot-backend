// Es más fácil contestar los errores así pero bien lo podríamos quitar, igual si quieren no lo usen
const handleHttpError = (res, message = 'Algo pasó', code = 500) => {
    res.status(code);
    res.send({ error: message });
};

module.exports = { handleHttpError };