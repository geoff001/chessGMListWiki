import type { GMDataType, ChessAPIResponse, GmProfile } from "../types/chess";

const CHESS_API_BASE = 'https://api.chess.com/pub';

export class ChessApiService {
    static async getGMData(): Promise<GMDataType[]> {
        const response = await fetch(`${CHESS_API_BASE}/titled/GM`);

        if(!response.ok) throw new Error(`Error status: ${response.status}`);

        const data: ChessAPIResponse = await response.json();
        const usernames = data.players || [];
        const limitedUsernames = usernames.slice(0, 50);
        const gmPromises = limitedUsernames.map(async (username) => {
            try {
                const profile = await this.getPlayerProfile(username);

                if(profile) {
                    let countryData = null;

                    if(profile.country) countryData = await this.getCountryInfo(profile.country);
                    
                    return {
                        avatar: profile.avatar,
                        player_id: profile.player_id,
                        url: profile.url,
                        name: profile.name,
                        username: profile.username,
                        title: profile.title,
                        followers: profile.followers,
                        country_name: countryData?.name,
                        country_code: countryData?.code,
                        location: profile.location,
                        last_online: profile.last_online,
                        joined: profile.joined,
                        status: profile.status,
                        is_streamer: profile.is_streamer,
                        twitch_url: profile.twitch_url,
                        verified: profile.verified,
                        league: profile.league,
                        streaming_platform: profile.streaming_platform,
                    } as GMDataType;
                }

            } catch (error) {
                console.error(`Error fetching profile for ${username}:`, error);
            }
        });
        const gms = await Promise.all(gmPromises);
        return gms.filter((gm): gm is GMDataType => gm !== undefined);
    }

    static async getPlayerProfile(username: string): Promise<GmProfile | null> {
        try {
            const response = await fetch(`${CHESS_API_BASE}/player/${username}`);
        
            if (!response.ok) {
                if (response.status === 404) return null;

                throw new Error(`Error status: ${response.status}`);
            }
            
            const data: GmProfile = await response.json();
            
            return data;
        } catch (error) {
            console.error(`Error fetching profile for ${username}:`, error);
            return null;
        }
    }

    static async getCountryInfo(countryAPI: string): Promise<{code: string, name: string} | null> {
        try {
            const response = await fetch(countryAPI);

            if (!response.ok) throw new Error(`Error status: ${response.status}`);

            const data = await response.json();
            return {
                code: data.code || '',
                name: data.name || ''
            };
        } catch (error) {
            console.error(`Error fetching country info from ${countryAPI}:`, error);
            return null;
        }
    }

    static async getPlayerStats(username: string): Promise<any> {
        try {
            const response = await fetch(`${CHESS_API_BASE}/player/${username}/stats`);

            if (!response.ok) throw new Error(`Error status: ${response.status}`);

            return await response.json();
        } catch (error) {
            console.error(`Error fetching stats for ${username}:`, error);
            return null;
        }
    }

}