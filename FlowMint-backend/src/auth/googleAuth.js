const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return {
            success: true,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
            googleId: payload.sub
        };
    } catch (error) {
        console.error('Error verifying Google token:', error);
        return {
            success: false,
            error: 'Invalid Google token'
        };
    }
}

module.exports = {
    verifyGoogleToken
};