export interface IAlbum {
    title: string,
    artist: string,
    release_year: number,
    description: string | null,
    image: string | null,
    isPublished?: boolean,
    user: string
}

export interface IArtist {
    name: string,
    description: string | null,
    photo: string | null,
    isPublished?: boolean,
    user: string
}

export interface ITrack {
    title: string,
    duration: string,
    album: string,
    isPublished?: boolean,
    user: string
}

export interface IUserFields {
    username: string,
    password: string,
    role: string,
    token: string
}

interface IArtistPopulated {
    name: string;
}

interface IAlbumPopulated {
    title: string;
    image: string,
    artist: IArtistPopulated;
}

interface ITrackPopulated {
    title: string;
    duration: string;
    album: IAlbumPopulated;
}

interface ITrackHistoryPopulated {
    _id: string;
    datetime: Date;
    track: ITrackPopulated;
}