import './List.css';
import Card from "../Card/Card";

function List({ posts }) {
    return (
        <div className="list-container my-4">
            {Array.isArray(posts) && posts.length > 0 ? (
                <div className="card-grid">
                    {posts.map((item) => (
                        <Card key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <p className="no-posts-message">No posts available.</p>
            )}
        </div>
    );
}

export default List;
