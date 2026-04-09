export interface IAlbum {
    _id: string,
    title: string,
    artist: string,
    release_year: number,
    description: string | null,
    image: string | null,
    isPublished: boolean,
}

export interface IAlbumMutation extends IAlbum {
    artist: IArtist,
}

export interface IAlbumForm {
    title: string,
    artist: string,
    release_year: number | null,
    description: string | null,
    image: File | string | null;
}

export interface IArtist {
    _id: string,
    name: string,
    description: string | null,
    photo: string | null,
    isPublished: boolean,
}

export interface IArtistForm {
    name: string,
    description: string | null,
    photo: File | string | null,
}

export interface ITrack {
    _id: string,
    title: string,
    duration: string,
    album: string,
    track_number: number,
    isPublished: boolean,
}

export interface ITrackForm {
    title: string,
    duration: string,
    album: string,
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
    _id: string,
    username: string,
    token: string,
    role: string,
}

export interface IValidationError {
    errors: {
        [key: string]: {
            name: string,
            message: string,
        }
    },
    message: string,
    name: string,
    _message: string,
}

export interface IGlobalError {
    error: string,
}

export interface IRegisterMutation {
    username: string,
    password: string,
}

export interface ILoginMutation {
    username: string,
    password: string,
}