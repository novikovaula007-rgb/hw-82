import path from "path";

const rootPath = __dirname;

const config = {
    rootPath,
    publicPath: path.join(rootPath, 'public'),
    db: 'mongodb://localhost/music-api-js-30-ulyana',
    JWTSecret: process.env.JWT_SECRET || 'secret',
    clientSecret: process.env.CLIENT_SECRET || 'secret',
    clientID: process.env.CLIENT_ID || '...',
};

export default config;