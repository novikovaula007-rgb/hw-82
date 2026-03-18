import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import artistsRouter from "./routes/artists";
import albumsRouter from "./routes/albums";
import tracksRouter from "./routes/tracks";
import {usersRouter} from "./routes/users";

const port = 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/artists', artistsRouter);
app.use('/albums', albumsRouter);
app.use('/tracks', tracksRouter);
app.use('/users', usersRouter);

const run = async () => {
    await mongoose.connect('mongodb://localhost/music-api-js-30-ulyana');

    app.listen(port, () => {
        console.log("Server running on port " + port)
    })

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

run().catch((err) => console.error(err));