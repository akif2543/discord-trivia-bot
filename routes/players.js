const Router = require('express-promise-router');
const Player = require('../db/models/Player');

const router = new Router;

router.get('/', async (req, res, next) => {
    const name = req.query.player;
    const server = req.query.server;
    const limit = req.query.limit;

    try {
         if (name) {
            const player = await Player.findOne({name: name, server: server})
            res.json(player);
         } else if (limit) {
            const custom = await Player.find({server: server}).sort({total_score: 1}).limit(limit)
            res.json(custom);
         } else {
            const topFive = await Player.find({server: server}).sort({total_score: 1}).limit(5)
            res.json(topFive);
         };
    } catch(err) {
        console.error(err);
        next(err);
    };
});

router.post('/', async (req, res, next) =>{
    const data = {
        name: req.query.player,
        server: req.query.server,
    };
    
    try {
        const newPlayer = new Player(data)
        const savedPlayer = await newPlayer.save();
        res.json(savedPlayer);
    } catch(err) {
        console.error(err);
        next(err);
    };
});

router.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    const value = parseInt(req.query.value);

    try {
        const player = await Player.findById(id);
        player.weekScore += value;
        player.totalScore += value;
        const updated = await player.save();
        res.json(updated);
    } catch(err) {
        console.error(err);
        next(err);
    };
});

module.exports = router;