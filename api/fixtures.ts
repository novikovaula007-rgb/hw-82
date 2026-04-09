import config from "./config";
import mongoose from "mongoose";
import Artist from "./models/Artist";
import Album from "./models/Album";
import Track from "./models/Track";
import User from "./models/User";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('tracks');
        await db.dropCollection('albums');
        await db.dropCollection('artists');
        await db.dropCollection('trackhistories');
    } catch (e) {
        console.log('Collections were not present, skipping drop...');
    }

    const [Katya, Andrey, John] = await User.create({
            username: 'katya224',
            password: '123',
            token: 'test-token-123',
        }, {
            username: 'Andrey',
            password: '123',
            token: 'test-token-1234',
        }, {
            username: 'John',
            password: '123',
            token: 'test-token-1235',
        },
    );

    const [Radiohead, LanaDelRey, Nirvana] = await Artist.create({
            name: 'Radiohead',
            photo: 'fixtures/artist_radiohead.jpg',
            user: Katya!._id,
            isPublished: true,
            description: 'Radiohead is an influential English alternative rock band formed in 1985, known for evolving from guitar-driven rock to experimental, electronic-influenced soundscapes'
        }, {
            name: 'Lana Del Rey',
            photo: 'fixtures/artist_lana_del_rey.webp',
            user: Andrey!._id,
            isPublished: true,
            description: 'Lana Del Rey is an American singer-songwriter. Her music is noted for its melancholic exploration of glamor and romance.'
        }, {
            name: 'Nirvama',
            photo: null,
            user: John!._id,
            isPublished: false,
            description: 'Nirvana revolutionized early 1990s rock by pioneering grunge, a subgenre blending punk rock\'s raw energy with heavy metal\'s sludge and pop melodies. Their sound is defined by dynamic "loud-quiet" shifts—alternating soft verses with explosive, distorted choruses. Lyrics, primarily written by Kurt Cobain, reflected Generation X angst, alienation, and poignant, cynical themes.'
        },
    );

    const [OKComputer, InRainbows, Stove, BornToDie, Nevermind] = await Album.create({
        title: 'OK Computer',
        user: Katya!._id,
        description: 'OK Computer (1997) is Radiohead’s critically acclaimed third studio album, widely regarded as a dystopian art-rock masterpiece that defines 1990s music. It explores themes of technological anxiety, isolation, consumerism, and political corruption. It is known for its atmospheric sound, innovative instrumentation, and prescient, critical view of modern life.',
        image: 'fixtures/album_ok_computer.jpg',
        release_year: 1997,
        isPublished: true,
        artist: Radiohead!._id
    }, {
        title: 'In Rainbows',
        user: Katya!._id,
        description: 'In Rainbows (2007) is Radiohead’s seventh studio album, celebrated for blending warm, organic instrumentation with intimate songwriting, marking a shift toward vulnerability compared to their earlier, colder electronic work.',
        image: 'fixtures/album_in_rainbows.jpg',
        release_year: 2007,
        isPublished: true,
        artist: Radiohead!._id
    }, {
        title: 'Stove',
        user: Andrey!._id,
        description: 'Stove is the tenth studio album by Lana Del Rey, scheduled for release on May 22, 2026, featuring a country music style. The album is described as a "domestic" and "autobiographical" project.',
        image: 'fixtures/album_stove.webp',
        release_year: 2026,
        isPublished: true,
        artist: LanaDelRey!._id
    }, {
        title: 'Born To Die',
        user: Andrey!._id,
        description: 'Lana Del Rey`s Born to Die (2012) is a cinematic baroque pop and trip-hop album defining early 2010s "sad girl" aesthetic. It centers on themes of doomed romance, toxic relationships, 1950s/60s Americana nostalgia, and youth rebellion.',
        image: 'fixtures/album_born_to_die.jpg',
        release_year: 2012,
        isPublished: true,
        artist: LanaDelRey!._id
    }, {
        title: 'Nevermind',
        user: John!._id,
        description: 'Released on September 24, 1991, Nevermind is Nirvana\'s landmark second album that propelled grunge from a Seattle subculture to global popularity, ending the dominance of glam metal. Produced by Butch Vig, it features a mix of intense punk energy and pop-influenced melody. The iconic cover, featuring a baby swimming toward a dollar bill on a fishhook, was designed to represent life-threatening materialism.',
        image: null,
        release_year: 1991,
        isPublished: false,
        artist: Nirvana!._id
    });

    const tracks = [{
        title: 'Airbag',
        duration: '4:47',
        isPublished: true,
        user: Katya!._id,
        album: OKComputer!._id
    }, {
        title: 'Paranoid Android',
        duration: '6:27',
        isPublished: true,
        user: Katya!._id,
        album: OKComputer!._id
    }, {
        title: 'Subterranean Homesick Alien',
        duration: '4:27',
        isPublished: true,
        user: Katya!._id,
        album: OKComputer!._id
    }, {
        title: 'Exit Music',
        duration: '4:27',
        isPublished: true,
        user: Katya!._id,
        album: OKComputer!._id
    }, {
        title: 'Let Down',
        duration: '4:59',
        isPublished: true,
        user: Katya!._id,
        album: OKComputer!._id
    }, {
        title: '15 Step',
        duration: '4:47',
        isPublished: true,
        user: Katya!._id,
        album: InRainbows!._id
    }, {
        title: 'Bodysnatchers',
        duration: '3:27',
        isPublished: true,
        user: Katya!._id,
        album: InRainbows!._id
    }, {
        title: 'House of Cards',
        duration: '4:27',
        isPublished: true,
        user: Katya!._id,
        album: InRainbows!._id
    }, {
        title: 'All I Need',
        duration: '3:48',
        isPublished: true,
        user: Andrey!._id,
        album: InRainbows!._id
    }, {
        title: 'Videotape',
        duration: '4:39',
        isPublished: true,
        user: Andrey!._id,
        album: InRainbows!._id
    }, {
        title: 'Henry, Come On',
        duration: '4:47',
        isPublished: true,
        user: Andrey!._id,
        album: Stove!._id
    }, {
        title: 'White Feather Hawk Tail Deer Hunter',
        duration: '3:27',
        isPublished: true,
        user: Andrey!._id,
        album: Stove!._id
    }, {
        title: 'Bluebird',
        duration: '4:27',
        isPublished: true,
        user: Andrey!._id,
        album: Stove!._id
    }, {
        title: 'Quiet in the South',
        duration: '3:48',
        isPublished: true,
        user: Andrey!._id,
        album: Stove!._id
    }, {
        title: 'Stand by Your Man',
        duration: '4:39',
        isPublished: true,
        user: Andrey!._id,
        album: Stove!._id
    }, {
        title: 'Off to the Races',
        duration: '4:47',
        isPublished: true,
        user: Andrey!._id,
        album: BornToDie!._id
    }, {
        title: 'Blue Jeans',
        duration: '3:27',
        isPublished: true,
        user: Andrey!._id,
        album: BornToDie!._id
    }, {
        title: 'Video Games',
        duration: '4:27',
        isPublished: true,
        user: Andrey!._id,
        album: BornToDie!._id
    }, {
        title: 'Dark Paradise',
        duration: '3:48',
        isPublished: true,
        user: Andrey!._id,
        album: BornToDie!._id
    }, {
        title: 'Radio',
        duration: '4:39',
        isPublished: true,
        user: Andrey!._id,
        album: BornToDie!._id
    }, {
        title: 'Smells Like Teen Spirit',
        duration: '4:39',
        isPublished: false,
        user: John!._id,
        album: Nevermind!._id
    }, {
        title: 'Come As You Are',
        duration: '3:20',
        isPublished: false,
        user: John!._id,
        album: Nevermind!._id
    }, {
        title: 'Drain You',
        duration: '5:51',
        isPublished: false,
        user: John!._id,
        album: Nevermind!._id
    }];

    for (const track of tracks) {
        await Track.create(track)
    }

    await db.close();
}

run().catch(console.error);