import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

function PropertyCard({ item }) {
  // Format price with Indian currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="property-card">
      <div className="image-container">
        <img
          src={item.images?.[0] || '/path/to/default/image.png'}
          alt={item.title}
          className="property-image"
        />
        <div className="price-tag">
          {formatPrice(item.price)}
        </div>
      </div>
      
      <div className="content">
        <h2 className="property-title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        
        <p className="property-address">
          <svg 
            className="address-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{item.address}</span>
        </p>
        
        <div className="divider"></div>
        
        <div className="property-features">
          <div className="feature">
            {/* Modern Bed Icon */}
            <svg
              className="feature-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 4v16" />
              <path d="M2 8h18a2 2 0 0 1 2 2v10" />
              <path d="M2 17h20" />
              <path d="M6 8v9" />
            </svg>
            <span>{item.bedroom} Beds</span>
          </div>
          
          <div className="feature">
            {/* Modern Bath Icon */}
            <svg
              className="feature-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1v0Z" />
              <path d="M6 12V5a2 2 0 0 1 2-2h3v2.25" />
              <path d="m4 21 1-1.5" />
              <path d="m20 21-1-1.5" />
            </svg>
            <span>{item.bathroom} Baths</span>
          </div>
        </div>
      </div>
      
      <Link to={`/${item.id}`} className="card-link" aria-label={`View details for ${item.title}`} />
    </div>
  );
}

export default PropertyCard;