import { useState } from 'react';
import './Slider.css';

function Slider({ images = [] }) {
    const [imageIndex, setImageIndex] = useState(0); // Initialize with 0 to avoid errors
    const [isFullScreen, setIsFullScreen] = useState(false); // Track whether in full-screen mode

    const changeSlide = (direction) => {
        if (images.length > 0) {
            setImageIndex((prevIndex) => 
                direction === 'left'
                    ? (prevIndex === 0 ? images.length - 1 : prevIndex - 1)
                    : (prevIndex === images.length - 1 ? 0 : prevIndex + 1)
            );
        }
    };

    const openFullScreen = (index) => {
        setImageIndex(index); // Set the clicked image index
        setIsFullScreen(true); // Enter full-screen mode
    };

    const closeFullScreen = () => {
        setIsFullScreen(false); // Exit full-screen mode
    };

    if (images.length === 0) {
        return <div>No images available</div>;
    }

    return (
        <div className="slider">
            {isFullScreen && (
                <div className="fullSlider">
                    <div className="arrow left" onClick={() => changeSlide("left")}>
                        <img src="/left arrow.png" alt="Left Arrow" />
                    </div>
                    <div className="imgContainer">
                        <img src={images[imageIndex]} alt="" />
                    </div>
                    <div className="arrow right" onClick={() => changeSlide("right")}>
                        <img src="/arrow.png" alt="Right Arrow" />
                    </div>
                    <div className="close" onClick={closeFullScreen}>X</div>
                </div>
            )}
            <div className="bigiImage">
                <img src={images[0]} alt="" onClick={() => openFullScreen(0)} />
            </div>
            <div className="smallImages">
                {images.slice(1).map((image, index) => (
                    <img 
                        src={image} 
                        alt="" 
                        key={index} 
                        onClick={() => openFullScreen(index + 1)} // Open full screen on click
                    />
                ))}
            </div>
        </div>
    );
}

export default Slider;
