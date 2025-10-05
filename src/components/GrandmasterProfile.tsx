import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { GmProfile } from "../types/chess";
import { ChessApiService } from "../services/chessApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faArrowLeft, faUser, faVideo, faChess, faMapMarkerAlt, faTrophy, faExternalLinkAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import './GrandmasterProfile.css';

const GrandmasterProfile: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [gmProfile, setGmProfile] = useState<GmProfile | null>(null);
    const [gmStats, setGmStats] = useState<any>(null);
    const [lastOnline, setLastOnline] = useState<string>('');
    const navigate = useNavigate();

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

    const formatDate = (dateString?: number) => {
        if(!dateString) return 'N/A';
        const date = new Date(dateString * 1000);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    useEffect(() => {
        if(!gmProfile?.last_online) return;

        const updateClock = () => {
            setLastOnline(calcLastOnline(gmProfile?.last_online));
        }

        updateClock();

        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, [gmProfile]);

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
                <button className="back-button" onClick={() => navigate('/')}>
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
                        <p className="profile-username">@{gmProfile?.username}</p>
                        {gmProfile?.location && 
                            <p className="profile-location">
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                                {` ${gmProfile?.location}`}
                            </p>
                        }
                        {gmProfile?.league && gmProfile.league.trim() !== '' && (
                                <p className={`profile-league league-${gmProfile.league.toLowerCase()}`}>
                                    <FontAwesomeIcon icon={faTrophy} />
                                    {` ${gmProfile.league}`}
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
                            {'View on Chess.com '}
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
                        <p className="stat-text">{gmProfile?.status?.toUpperCase() || 'Unknown'}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Joined</h3>
                        <p className="stat-text">
                            {formatDate(gmProfile?.joined)}
                        </p>
                    </div>
                </div>

                {gmProfile?.last_online &&
                    <div className="live-clock-card">
                        <h3>TIME SINCE ONLINE</h3>
                        <div className="live-clock">
                            <span className="clock-icon">
                                <FontAwesomeIcon icon={faClock} />
                            </span>
                            <span className="clock-time">
                                {lastOnline}
                            </span>
                        </div>
                    </div>
                }

                {gmProfile?.streaming_platforms && gmProfile.streaming_platforms.length > 0 &&
                    <div className="streaming-section">
                        <h3>Streaming Platforms</h3>
                        <div className="streaming-platforms">
                            {gmProfile.streaming_platforms.map((platform, index) => (
                                <a
                                    key={index}
                                    href={platform.channel_url}
                                    className="platform-link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FontAwesomeIcon icon={faVideo} />
                                    {` ${platform.type?.toUpperCase()}`}
                                </a>
                            ))}
                        </div>
                    </div>
                }

                {gmStats &&
                    <div className="chess-stats-section">
                        <h3>Chess Statistics</h3>
                        <div className="stats-grid">
                            {gmStats.chess960_daily &&
                                <div className="stat-card">
                                    <h4>960 Daily</h4>
                                    <p className="stat-number">
                                        {gmStats.chess960_daily?.last?.rating || 'N/A'}
                                    </p>
                                    <p className="stat-label">
                                        Last: {formatDate(gmStats.chess960_daily?.last?.date)}
                                    </p>
                                </div>
                            }

                            {gmStats.chess_daily &&
                                <div className="stat-card">
                                    <h4>Daily</h4>
                                    <p className="stat-number">
                                        {gmStats.chess_daily?.last?.rating || 'N/A'}
                                    </p>
                                    <p className="stat-label">
                                        Last: {formatDate(gmStats.chess_daily?.last?.date)}
                                    </p>
                                </div>
                            }

                            {gmStats.chess_rapid &&
                                <div className="stat-card">
                                    <h4>Rapid</h4>
                                    <p className="stat-number">
                                        {gmStats.chess_rapid?.last?.rating || 'N/A'}
                                    </p>
                                    <p className="stat-label">
                                        Last: {formatDate(gmStats.chess_rapid?.last?.date)}
                                    </p>
                                </div>
                            }

                            {gmStats.chess_blitz &&
                                <div className="stat-card">
                                    <h4>Blitz</h4>
                                    <p className="stat-number">
                                        {gmStats.chess_blitz?.last?.rating || 'N/A'}
                                    </p>
                                    <p className="stat-label">
                                        Last: {formatDate(gmStats.chess_blitz?.last?.date)}
                                    </p>
                                </div>
                            }

                            {gmStats.chess_bullet &&
                                <div className="stat-card">
                                    <h4>Bullet</h4>
                                    <p className="stat-number">
                                        {gmStats.chess_bullet?.last?.rating || 'N/A'}
                                    </p>
                                    <p className="stat-label">
                                        Last: {formatDate(gmStats.chess_bullet?.last?.date)}
                                    </p>
                                </div>
                            }
                        </div>
                    </div>
                }

                <div className="profile-details">
                    <h3>Profile Details</h3>
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="detail-label">Player ID:</span>
                            <span className="detail-value">{gmProfile?.player_id || 'N/A'}</span>
                        </div>
                        
                        {gmStats?.fide &&
                            <div className="detail-item">
                                <span className="detail-label">FIDE Rating:</span>
                                <span className="detail-value">{gmStats?.fide || 'N/A'}</span>
                            </div>
                        }
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default GrandmasterProfile;