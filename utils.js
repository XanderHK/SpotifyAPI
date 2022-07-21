const axios = require('axios');
const { CLIENT_ID, CLIENT_SECRET, BASE_URI } = require('./cfg');

/**
 * Makes a request to the Spotify API to get an access token.
 * https://developer.spotify.com/documentation/general/guides/authorization/client-credentials/
 * @returns {Promise<{access_token: string, expires_in: number}>}
 */
const authorize = async () => {
    const data = new URLSearchParams({
        grant_type: 'client_credentials',
        json: true
    })

    const headers = {
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    try {
        const res = await axios.post('https://accounts.spotify.com/api/token', data.toString(), headers)
        return [res.data, null]
    } catch (err) {
        return [null, err]
    }
}

const getRandomSearch = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz';

    const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
    let randomSearch = '';

    switch (Math.round(Math.random())) {
        case 0:
            randomSearch = randomCharacter + '%';
            break;
        case 1:
            randomSearch = '%' + randomCharacter + '%';
            break;
    }

    return randomSearch;
}

const getRandomTrack = async (params) => {
    try {
        const { q, offset, access_token } = params;

        const res = await axios.get('https://api.spotify.com/v1/search', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token.access_token

            },
            params: {
                q: q,
                type: 'track',
                limit: 1,
                include_external: 'audio',
                offset: offset
            }
        })

        const result = {
            spotify_url: res.data.tracks.items[0].external_urls.spotify,
            name: res.data.tracks.items[0].name,
            artist: res.data.tracks.items[0].artists[0].name,
            image: res.data.tracks.items[0].album.images[0].url,
            preview_url: res.data.tracks.items[0].preview_url ?? null
        }

        return [result, null]
    } catch (err) {
        return [null, err]
    }
}

const getRandomOffset = () => Math.floor(Math.random() * 999);

// Exports the functions
exports.authorize = authorize
exports.getRandomSearch = getRandomSearch
exports.getRandomOffset = getRandomOffset
exports.getRandomTrack = getRandomTrack