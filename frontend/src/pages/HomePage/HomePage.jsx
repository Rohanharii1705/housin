import React, { useContext } from 'react';
import './HomePage.css';
import SearchBar from '../../components/SearchBar/SearchBar';
import { AuthContext } from '../../context/AuthContext';

function HomePage() {
    const { currentUser } = useContext(AuthContext);
    
    console.log(currentUser);

    return (
        <div className="home-page">
            <div className="text-container">
                <h1 className="title" style={{ color: 'white' }}>Find Properties & Get Your Dream Place</h1>
                <p className="lead">
                    Welcome to HousIN, your trusted partner in finding the perfect home! 
                    Whether you're looking to buy or rent, HousIN makes the search for real 
                    estate simpler, smarter, and more accessible. With a seamless interface, 
                    extensive property listings, and powerful tools, we empower you to find 
                    the ideal property that fits your needs and lifestyle.
                </p>
                <SearchBar />
                <div className="stats">
                    <div className="box">
                        <h1>16+</h1>
                        <h2>Years of Experience</h2>
                    </div>
                    <div className="box">
                        <h1>200</h1>
                        <h2>Awards Gained</h2>
                    </div>
                    <div className="box">
                        <h1>1200+</h1>
                        <h2>Properties Ready</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
