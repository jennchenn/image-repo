exports.health = (req, res) => {
    res.send({
        status: 'UP'
    });
};