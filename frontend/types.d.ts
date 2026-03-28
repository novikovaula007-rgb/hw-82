export interface IAlbum {
    _id: string;
    title: string,
    artist: string,
    release_year: number,
    description: string | null,
    image: string | null
}

export interface IAlbumMutation extends IAlbum {
    artist: IArtist,
}

export interface IArtist {
    _id: string;
    name: string,
    description: string | null,
    photo: string | null
}

export interface ITrack {
    _id: string;
    title: string,
    duration: string,
    album: string,
    track_number: number
}

export interface ITrackHistory {
    _id: string,
    datetime: Date,
    trackName: string,
    trackDuration: string,
    artistName: string,
    albumTitle: string,
    albumImage: string
}

export interface IUser {
    _id: string;
    username: string;
    token: string;
}

export interface IValidationError {
    errors: {
        [key: string]: {
            name: string;
            message: string;
        }
    },
    message: string;
    name: string;
    _message: string;
}

export interface IGlobalError {
    error: string;
}

export interface IRegisterMutation {
    username: string;
    password: string;
}

export interface ILoginMutation {
    username: string;
    password: string;
}