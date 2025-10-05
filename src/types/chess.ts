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
    twitch_url?: string;
    verified?: boolean;    
    league?: string;
    streaming_platform?: StreamingPlatform[];
}

export interface StreamingPlatform {
    type?: string;
    channel?: string;
}

export interface ChessAPIResponse {
    players: string[];
}

export interface GmProfile extends GMDataType {
    country?: string;
    country_code_from_url?: string;
    fide?: number;
    uscf?: number;
    ecf?: number;
    rcf?: number;
    cfc?: number;
    dsb?: number;
}