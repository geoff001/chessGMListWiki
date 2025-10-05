import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { GmProfile } from "../types/chess";
import { ChessApiService } from "../services/chessApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faArrowLeft, faUser, faVideo, faChess, faMapMarkerAlt, faTrophy, faExternalLinkAlt, faClock } from "@fortawesome/free-solid-svg-icons";

const GrandmasterProfile: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [gmProfile, setGmProfile] = useState<GmProfile | null>(null);
    const [gmStats, setGmStats] = useState<any>(null);

    useEffect(() => {
        const fetchGMProfile = async () => {
            if (!username) return;

            try {
                setIsLoading(true);
                const [profileData, statsData] = await Promise.all([
                    ChessApiService.getPlayerProfile(username),
                    ChessApiService.getPlayerStats(username)
                ]);

                if (profileData) {
                    setGmProfile(profileData);
                    setGmStats(statsData);
                }
            } catch (error) {
                console.error('Error fetching GM profile or stats:', error);
            } finally {
                setIsLoading(false);
            }

        }
        fetchGMProfile();
    }, [username]);

    const calcLastOnline = (timestamp?: number) => {
        if (!timestamp) return 'Unknown';
        
        const now = Date.now() / 1000;
        const diff = Math.floor(now - timestamp);

        if (diff < 0) return '00:00:00';
        
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    if (isLoading) {
        return (
            <div className="profile-container">
                <div className="profile-loading">
                    <div className="chess-loader">
                        <div className="chess-piece">
                            <FontAwesomeIcon icon={faCrown} />
                        </div>
                        <p>Loading Grandmaster Profile...</p>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="profile-container">
            <div className="profile-header">
                <button className="back-button">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Back to Grandmasters list
                </button>

                <div className="profile-main-info">
                    <div className="profile-avatar-section">
                        {gmProfile?.avatar ? (
                            <img src={gmProfile.avatar} alt={gmProfile.username} />
                        ) : (
                            <div className="profile-avatar-placeholder">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                        )}

                        <div className="profile-badges">
                            {gmProfile?.title &&
                                <span className="title-badge">{gmProfile.title}</span>
                            }
                            <span className={`verified-badge ${gmProfile?.verified ? 'verified' : 'not-verified'}`}>
                                {gmProfile?.verified ? 'Verified' : 'Not Verified'}
                            </span>
                            {gmProfile?.is_streamer && (
                                <span className="streamer-badge">
                                    <FontAwesomeIcon icon={faVideo} />
                                    {' Streamer'}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="profile-info">
                        <h1 className="profile-name"><FontAwesomeIcon icon={faChess} /> {gmProfile?.name || gmProfile?.username}</h1>
                        <p className="profile-username">@ {gmProfile?.username}</p>
                        {gmProfile?.location && 
                            <p className="profile-location">
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                                {` ${gmProfile?.location}`}
                            </p>
                        }
                        {gmProfile?.league && gmProfile.league.trim() !== '' && (
                                <p className={`profile-league league-${gmProfile.league.toLowerCase()}`}>
                                    <FontAwesomeIcon icon={faTrophy} />
                                    {gmProfile.league}
                                </p>
                        )}
                    </div>
                    
                    <div className="profile-actions">
                        <a 
                            href={gmProfile?.url} 
                            className="external-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View on Chess.com
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </a>
                    </div>
                </div>
            </div>
            
            <div className="profile-content">
                <div className="profile-stats">
                    <div className="stat-card">
                        <h3>Followers</h3>
                        <p className="stat-number">{gmProfile?.followers?.toLocaleString() || 'N/A'}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Status</h3>
                        <p className="stat-text">{gmProfile?.status || 'Unknown'}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Joined</h3>
                        <p className="stat-text">
                            {gmProfile?.joined 
                                ? new Date(gmProfile.joined * 1000).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }) 
                                : 'Unknown'
                            }
                        </p>
                    </div>

                    {gmProfile?.last_online &&
                        <div className="stat-card live-clock-card">
                            <h3>Time Since Online</h3>
                            <div className="live-clock">
                                <span className="clock-icon">
                                    <FontAwesomeIcon icon={faClock} />
                                </span>
                                <span className="clock-time">
                                    {gmProfile.last_online}
                                </span>
                            </div>
                        </div>
                    }

                </div>
            </div>
        </div>
    );
}

export default GrandmasterProfile;