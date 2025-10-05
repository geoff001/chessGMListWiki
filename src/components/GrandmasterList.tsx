import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faCrown } from "@fortawesome/free-solid-svg-icons";
import { ChessApiService } from "../services/chessApi";
import type { GMDataType } from "../types/chess";
import './GrandmasterList.css';
import GrandmasterCard from "./GrandmasterCard";

const GrandmasterList: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [gmList, setGmList] = useState<GMDataType[]>([]);
    const [searchCriteria, setSearchCriteria] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'country' | 'followers' | 'username'>('username');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchGMData = async () => {
            try {
                setIsLoading(true);
                const GMData = await ChessApiService.getGMData();
                setGmList(GMData);
            } catch (error) {
                console.error('Error fetching Grandmasters data:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchGMData();
    }, []);

    const filteredGms = gmList.filter(gm => {
        const searchTerm = gm.username?.toLowerCase().includes(searchCriteria.toLowerCase()) ||
                        (gm.name && gm.name.toLowerCase().includes(searchCriteria.toLowerCase()));
        return searchTerm;
    });

    const sortedGms = [...filteredGms].sort((a, b) => {
        let aVal: string | number = '';
        let bVal: string | number = '';

        switch (sortBy) {
            case 'name':
                aVal = a.name || a.username || '';
                bVal = b.name || b.username || '';
                break;
            case 'country':
                aVal = a.country_name || '';
                bVal = b.country_name || '';
                break;
            case 'followers':
                aVal = a.followers || 0;
                bVal = b.followers || 0;
                break;
            case 'username':
            default:
                aVal = a.username || '';
                bVal = b.username || '';
                break;
        }

        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        } else {
            return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
        }
    });

    const handleCardClick = (gm: GMDataType) => {
        console.log(`Clicked on ${gm.username}`);
        navigate(`/profile/${gm.username}`);
    }

    if (isLoading) {
        return (
        <div className="grandmaster-wiki">
            <header className="wiki-header">
                <h1 className="wiki-title">
                    <span className="chess-icon"><FontAwesomeIcon icon={faCrown} /></span>
                    Chess Grandmasters Wiki
                </h1>
                <p className="wiki-subtitle">
                    Discover the world's greatest chess players
                </p>
            </header>

            <div className="loading-container">
                <div className="chess-loader">
                    <div className="chess-piece"><FontAwesomeIcon icon={faCrown} /></div>
                    <p>Loading Grandmasters...</p>
                </div>
            </div>
        </div>
        );
    }

    return (
        <div className="grandmaster-wiki">
        <header className="wiki-header">
            <h1 className="wiki-title">
                <span className="chess-icon"><FontAwesomeIcon icon={faCrown} /></span>
                Chess Grandmasters Wiki
            </h1>
            <p className="wiki-subtitle">
                Discover the world's greatest chess players
            </p>
        </header>

        <div className="stats-section">
            <div className="stat-card">
                <h3>Total Grandmasters</h3>
                <p className="stat-number">{gmList.length}</p>
            </div>
            <div className="stat-card">
                <h3>Showing in List</h3>
                <p className="stat-number">{sortedGms.length}</p>
            </div>
            <div className="stat-card">
                <h3>Verified</h3>
                <p className="stat-number">
                    {gmList.filter(gm => gm.verified).length}
                </p>
            </div>
        </div>

        <div className="filters-section">
            <div className="filter-controls">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search grandmasters..."
                        value={searchCriteria}
                        onChange={(e) => setSearchCriteria(e.target.value)}
                        className="search-input"
                    />
                </div>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'country' | 'followers' | 'username')}
                    className="sort-filter"
                >
                    <option value="username">Sort by Username</option>
                    <option value="name">Sort by Name</option>
                    <option value="country">Sort by Country</option>
                    <option value="followers">Sort by Followers</option>
                </select>

                <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="sort-order-btn"
                    title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                    <FontAwesomeIcon icon={sortOrder === 'asc' ? faArrowUp :  faArrowDown} />
                </button>
            </div>
        </div>
        
        <div className="grandmasters-grid">
            {sortedGms.map((gm) => (
                <GrandmasterCard
                    key={gm.player_id}
                    grandmaster={gm}
                    onClick={() => handleCardClick(gm)}
                />
            ))}
        </div>

        {sortedGms.length === 0 && (
            <div className="no-results">
                <h3>No Grandmasters found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        )}
        </div>
    );
};

export default GrandmasterList;