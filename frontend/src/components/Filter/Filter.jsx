import { useSearchParams } from 'react-router-dom';
import './Filter.css';
import { useState } from 'react';

function Filter() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState({
        type: searchParams.get("type") || "",
        city: searchParams.get("city") || "",
        property: searchParams.get("property") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        bedroom: searchParams.get("bedroom") || "",
    });

    const handleChange = (e) => {
        setQuery({
            ...query,
            [e.target.name]: e.target.value,
        });
    };

    const handleFilter = () => {
        setSearchParams(query);
    };

    return (
        <div className="filter p-3 rounded mb-4">
            <h1 className="filterTitle">
                Search results for <b>{searchParams.get("city")}</b>
            </h1>
            <div className="row filterTop">
                <div className="col-12 col-md-6 mb-3">
                    <label htmlFor="city">Location</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        placeholder="City Location"
                        onChange={handleChange}
                        value={query.city}
                        className="form-control"
                    />
                </div>
            </div>
            <div className="row filterBottom">
                <div className="col-6 col-md-3 mb-3">
                    <label htmlFor="type">Type</label>
                    <select
                        name="type"
                        id="type"
                        onChange={handleChange}
                        value={query.type}
                        className="form-select"
                    >
                        <option value="">Any</option>
                        <option value="buy">Buy</option>
                        <option value="rent">Rent</option>
                    </select>
                </div>
                <div className="col-6 col-md-3 mb-3">
                    <label htmlFor="property">Property</label>
                    <select
                        name="property"
                        id="property"
                        onChange={handleChange}
                        value={query.property}
                        className="form-select"
                    >
                        <option value="">Any</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="condo">Condo</option>
                    </select>
                </div>
                <div className="col-6 col-md-3 mb-3">
                    <label htmlFor="minPrice">Min Price</label>
                    <input
                        type="number"
                        id="minPrice"
                        name="minPrice"
                        placeholder="Any"
                        onChange={handleChange}
                        value={query.minPrice}
                        className="form-control"
                    />
                </div>
                <div className="col-6 col-md-3 mb-3">
                    <label htmlFor="maxPrice">Max Price</label>
                    <input
                        type="number"
                        id="maxPrice"
                        name="maxPrice"
                        placeholder="Any"
                        onChange={handleChange}
                        value={query.maxPrice}
                        className="form-control"
                    />
                </div>
                <div className="col-6 col-md-3 mb-3">
                    <label htmlFor="bedroom">Bedrooms</label>
                    <input
                        type="number"
                        id="bedroom"
                        name="bedroom"
                        placeholder="Any"
                        onChange={handleChange}
                        value={query.bedroom}
                        className="form-control"
                    />
                </div>
                <div className="col-12 col-md-3 mb-3 d-flex align-items-end">
                    <button className="btn btn-primary w-100" onClick={handleFilter}>
                        <img src="/search.png" alt="Search" className="me-2" />
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Filter;
