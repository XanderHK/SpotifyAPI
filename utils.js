const axios = require('axios');
const { sendRequest } = require('./axios');


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
        const { q, offset } = params;

        const res = await sendRequest({
            method: 'get',
            url: '/search', params: {
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

const getSuggestions = async (params) => {
    try {
        const { seed_id } = params;

        const res = await sendRequest({
            method: 'get',
            url: '/recommendations',
            params: {
                seed_tracks: seed_id,
            },
        })

        const suggestions = res.data.tracks.reduce((suggestions, current_track) => {
            const track = {
                name: current_track.album.name,
                artist: current_track.artists[0].name,
                spotify_url: current_track.external_urls.spotify,
                image: current_track.album.images[0].url,
                preview_url: current_track.preview_url ?? null
            }
            suggestions.push(track);
            return suggestions;
        }, []);

        return [suggestions, null];
    } catch (err) {
        return [null, err]
    }
}

const getSearchResults = async (params) => {
    try {
        const { q } = params;

        const res = await sendRequest({
            method: 'get',
            url: '/search',
            params: {
                q: q,
                type: 'track'
            }
        })

        const result = {
            names: res.data.tracks.items.reduce((acc, curr) => {
                acc.push({ name: curr.name, artist: curr.artists[0].name, id: curr.id })
                return acc
            }, [])
        }

        return [result, null]
    } catch (err) {
        return [null, err]
    }
}

// Exports the functions
exports.getRandomSearch = getRandomSearch
exports.getRandomOffset = getRandomOffset
exports.getRandomTrack = getRandomTrack
exports.getSearchResults = getSearchResults
exports.getSuggestions = getSuggestions