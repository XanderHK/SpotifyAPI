const axios = require('axios');
const { CLIENT_ID, CLIENT_SECRET } = require('./cfg');

const axiosInstance = axios.create({
    baseURL: 'https://api.spotify.com/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

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

const sendRequest = async (config) => {
    try {
        const [access_token, authorize_err] = await authorize();
        if (authorize_err) throw new Error('Authorization error ' + authorize_err.message)

        const res = await axiosInstance({
            ...config,
            headers: {
                ...config.headers,
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token.access_token
            }
        })

        return res
    } catch (err) {
        return err
    }
}

exports.sendRequest = sendRequest
exports.authorize = authorize
