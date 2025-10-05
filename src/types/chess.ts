export interface GMDataType {
    avatar?: string;
    player_id?: number;
    url?: string;
    name?: string;
    username?: string;
    title?: string;
    followers?: number;
    country_name?: string;
    country_code?: string;
    location?: string;
    last_online?: number;
    joined?: number;
    status?: string;
    is_streamer?: boolean;
    verified?: boolean;    
    league?: string;
    streaming_platforms?: StreamingPlatform[];
}

export interface StreamingPlatform {
    type?: string;
    channel_url?: string;
}

export interface ChessAPIResponse {
    players: string[];
}

export interface GmProfile extends GMDataType {
    country?: string;
    country_code_from_url?: string;
    fide?: number;
}