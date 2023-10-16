const express = require('express');
const router = express.Router();
const { getRandomOffset, getRandomTrack, getRandomSearch, getSearchResults, getSuggestions } = require('./utils');

router.get('/', async (req, res) => {
    const query = Object.keys(req.query).length !== 0 ? `genre:${req.query.genre}` : getRandomSearch();

    const [result, track_err] = await getRandomTrack({ q: query, offset: getRandomOffset() });

    if (track_err) {
        res.status(500).json({ error: track_err.message });
        return
    }

    res.status(200).json(result)
});

router.post('/search', async (req, res) => {
    const [result, search_err] = await getSearchResults({ q: req.body.query });

    if (search_err) {
        res.status(500).json({ error: search_err.message });
        return
    }

    res.status(200).json(result)
})

router.post('/suggestions', async (req, res) => {
    if (!req.body.seedId) return res.status(400).json({ error: 'Missing seedId' })
    const [result, suggestion_err] = await getSuggestions({ seed_id: req.body.seedId });
    if (suggestion_err) {
        res.status(500).json({ error: suggestion_err.message });
        return
    }

    res.status(200).json(result)
});

module.exports = router