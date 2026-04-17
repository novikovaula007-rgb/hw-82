import path from "path";

const rootPath = __dirname;

const config = {
    rootPath,
    publicPath: path.join(rootPath, 'public'),
    db: 'mongodb://localhost/music-api-js-30-ulyana',
    JWTSecret: process.env.JWT_SECRET || 'secret'
};

export default config;