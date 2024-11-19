import Card from '../../components/Card/Card';
import Filter from '../../components/Filter/Filter';
import { useLoaderData, Await } from 'react-router-dom';
import Map from '../../components/Map/Map';
import { Suspense } from 'react';
import './ListPage.css';

function ListPage() {
    const posts = useLoaderData();

    return (
        <div className="listPage py-4">
            <div className="listContainer">
                <h1 className="listTitle">Search Your Home</h1>
                <Filter />
                <div className="cardContainer">
                    <Suspense fallback={<p className="loadingMessage">Loading properties...</p>}>
                        <Await
                            resolve={posts.postResponse}
                            errorElement={<p className="loadingMessage">Error loading posts!</p>}
                        >
                            {(postResponse) =>
                                postResponse.data.length > 0 ? (
                                    postResponse.data.map((post) => (
                                        <div className="cardWrapper" key={post.id}>
                                            <Card item={post} />
                                        </div>
                                    ))
                                ) : (
                                    <p className="noResultsMessage">No properties found.</p>
                                )
                            }
                        </Await>
                    </Suspense>
                </div>
            </div>
            
            {/* Map Container moved below listContainer */}
            <div className="mapContainer">
                <Suspense fallback={<p className="loadingMessage">Loading map...</p>}>
                    <Await
                        resolve={posts.postResponse}
                        errorElement={<p className="loadingMessage">Error loading map!</p>}
                    >
                        {(postResponse) => <Map items={postResponse.data} />}
                    </Await>
                </Suspense>
            </div>
        </div>
    );
}

export default ListPage;
