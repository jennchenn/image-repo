exports.health = (req, res) => {
    res.status(200).send({
        status: 'UP'
    });
};