const express = require('express');
const { authorize, getRandomOffset, getRandomTrack, getRandomSearch } = require('./utils');
var cors = require('cors')
const app = express();
const router = express.Router();

app.use(cors())

router.get('/', async (req, res) => {
    const [access_token, authorize_err] = await authorize();

    if (authorize_err) {
        res.status(500).json({ error: authorize_err.message });
        return
    }

    const [result, track_err] = await getRandomTrack({ q: getRandomSearch(), offset: getRandomOffset(), access_token });

    if (track_err) {
        res.status(500).json({ error: track_err.message });
        return
    }

    res.status(200).json(result)
});

app.use('/', router);

app.listen(8888, () => {
    console.log('Server is running on port 8888');
});