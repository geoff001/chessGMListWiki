import type { GMDataType } from "../types/chess";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faFlag, faUsers, faVideo, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import './GrandmasterCard.css';

interface GmCardProps {
    grandmaster: GMDataType;
    onClick: () => void;
}
const GrandmasterCard: React.FC<GmCardProps> = ({ grandmaster, onClick }) => {
    return (
        <div className="gm-card" onClick={onClick}>
            <div className="gm-card-header">
                <div className="gm-avatar">
                    {grandmaster.avatar ? (
                        <img src={grandmaster.avatar} alt={grandmaster.username} />
                    ) : (
                        <div className="gm-avatar-placeholder">
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                    )
                    }
                </div>

                <div className="gm-header-right">
                    {grandmaster.is_streamer &&
                        <div className="gm-streamer-badge">
                            <FontAwesomeIcon icon={faVideo} />
                            {' Streamer'}
                        </div>
                    }
                    <div className="gm-title-badge-container">
                        {grandmaster.league && grandmaster.league.trim() !== '' && (
                            <div className={`gm-title-badge league-${grandmaster.league?.toLowerCase()}`}>
                                {grandmaster.league}
                            </div>
                        )}
                        <div className={`gm-verified-badge ${grandmaster.verified ? 'verified' : 'not-verified'}`}>
                            {grandmaster.verified ? 'Verified' : 'Not Verified'}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="gm-card-content">
                <h3 className="gm-username">{grandmaster.username}</h3>
                {grandmaster.name &&
                    <p className="gm-name">
                        <FontAwesomeIcon icon={faUser} /> 
                        {` ${grandmaster.name}`}
                    </p>
                }
                {grandmaster.country_name &&
                    <p className="gm-country">
                        <FontAwesomeIcon icon={faFlag} />
                        { grandmaster.location ? ` ${grandmaster.location}` : ` ${grandmaster.country_name}` }
                    </p>
                }
                {grandmaster.followers &&
                    <p className="gm-followers">
                        <FontAwesomeIcon icon={faUsers} />
                        {` ${grandmaster.followers}`}
                    </p>
                }
                {grandmaster.joined &&
                    <p className="gm-joined">
                        <span className="gm-joined-label">Joined: </span>
                        {` ${new Date(grandmaster.joined * 1000).toLocaleString(
                            'en-US',
                            {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            }
                        )}`}
                    </p>
                }
            </div>

            <div className="gm-card-footer">
                <span className="gm-profile-link">
                    View Profile <FontAwesomeIcon icon={faArrowRight} />
                </span>
            </div>
        </div>
    )
}

export default GrandmasterCard;