const express = require('express');
const router = express.Router();
const { authorize, getRandomOffset, getRandomTrack, getRandomSearch } = require('./utils');

router.get('/', async (req, res) => {
    const [access_token, authorize_err] = await authorize();

    if (authorize_err) {
        res.status(500).json({ error: authorize_err.message });
        return
    }

    const query = Object.keys(req.query).length !== 0 ? `genre:${req.query.genre}` : getRandomSearch();

    const [result, track_err] = await getRandomTrack({ q: query, offset: getRandomOffset(), access_token });

    if (track_err) {
        res.status(500).json({ error: track_err.message });
        return
    }

    res.status(200).json(result)
});

module.exports = router