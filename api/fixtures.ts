import config from "./config";
import mongoose from "mongoose";
import Artist from "./models/Artist";
import Album from "./models/Album";
import Track from "./models/Track";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('tracks');
        await db.dropCollection('albums');
        await db.dropCollection('artists');
    } catch (e) {
        console.log('Collections were not present, skipping drop...');
    }

    const [Radiohead, LanaDelRey] = await Artist.create({
        name: 'Radiohead',
        photo: 'fixtures/artist_radiohead.jpg',
        description: 'Radiohead is an influential English alternative rock band formed in 1985, known for evolving from guitar-driven rock to experimental, electronic-influenced soundscapes'
    }, {
        name: 'Lana Del Rey',
        photo: 'fixtures/artist_lana_del_rey.webp',
        description: 'Lana Del Rey is an American singer-songwriter. Her music is noted for its melancholic exploration of glamor and romance.'
    });

    const [OKComputer, InRainbows, Stove, BornToDie] = await Album.create({
        title: 'OK Computer',
        description: 'OK Computer (1997) is Radiohead’s critically acclaimed third studio album, widely regarded as a dystopian art-rock masterpiece that defines 1990s music. It explores themes of technological anxiety, isolation, consumerism, and political corruption. It is known for its atmospheric sound, innovative instrumentation, and prescient, critical view of modern life.',
        image: 'fixtures/album_ok_computer.jpg',
        release_year: 1997,
        artist: Radiohead!._id
    }, {
        title: 'In Rainbows',
        description: 'In Rainbows (2007) is Radiohead’s seventh studio album, celebrated for blending warm, organic instrumentation with intimate songwriting, marking a shift toward vulnerability compared to their earlier, colder electronic work.',
        image: 'fixtures/album_in_rainbows.jpg',
        release_year: 2007,
        artist: Radiohead!._id
    }, {
        title: 'Stove',
        description: 'Stove is the tenth studio album by Lana Del Rey, scheduled for release on May 22, 2026, featuring a country music style. The album is described as a "domestic" and "autobiographical" project.',
        image: 'fixtures/album_stove.webp',
        release_year: 2026,
        artist: LanaDelRey!._id
    }, {
        title: 'Born To Die',
        description: 'Lana Del Rey`s Born to Die (2012) is a cinematic baroque pop and trip-hop album defining early 2010s "sad girl" aesthetic. It centers on themes of doomed romance, toxic relationships, 1950s/60s Americana nostalgia, and youth rebellion.',
        image: 'fixtures/album_born_to_die.jpg',
        release_year: 2012,
        artist: LanaDelRey!._id
    });

    const tracks = [{
        title: 'Airbag',
        duration: '4:47',
        album: OKComputer!._id
    }, {
        title: 'Paranoid Android',
        duration: '6:27',
        album: OKComputer!._id
    }, {
        title: 'Subterranean Homesick Alien',
        duration: '4:27',
        album: OKComputer!._id
    }, {
        title: 'Exit Music',
        duration: '4:27',
        album: OKComputer!._id
    }, {
        title: 'Let Down',
        duration: '4:59',
        album: OKComputer!._id
    },{
        title: '15 Step',
        duration: '4:47',
        album: InRainbows!._id
    }, {
        title: 'Bodysnatchers',
        duration: '3:27',
        album: InRainbows!._id
    }, {
        title: 'House of Cards',
        duration: '4:27',
        album: InRainbows!._id
    }, {
        title: 'All I Need',
        duration: '3:48',
        album: InRainbows!._id
    }, {
        title: 'Videotape',
        duration: '4:39',
        album: InRainbows!._id
    },{
        title: 'Henry, Come On',
        duration: '4:47',
        album: Stove!._id
    }, {
        title: 'White Feather Hawk Tail Deer Hunter',
        duration: '3:27',
        album: Stove!._id
    }, {
        title: 'Bluebird',
        duration: '4:27',
        album: Stove!._id
    }, {
        title: 'Quiet in the South',
        duration: '3:48',
        album: Stove!._id
    }, {
        title: 'Stand by Your Man',
        duration: '4:39',
        album: Stove!._id
    },{
        title: 'Off to the Races',
        duration: '4:47',
        album: BornToDie!._id
    }, {
        title: 'Blue Jeans',
        duration: '3:27',
        album: BornToDie!._id
    }, {
        title: 'Video Games',
        duration: '4:27',
        album: BornToDie!._id
    }, {
        title: 'Dark Paradise',
        duration: '3:48',
        album: BornToDie!._id
    }, {
        title: 'Radio',
        duration: '4:39',
        album: BornToDie!._id
    }];

    for (const track of tracks) {
        await Track.create(track)
    }

    await db.close();
}

run().catch(console.error);