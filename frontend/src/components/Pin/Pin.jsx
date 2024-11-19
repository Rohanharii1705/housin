import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './Pin.css';
import customMarkerIcon from './marker.png'; // Adjust the path as needed
import { Link } from 'react-router-dom';

// Define your custom icon
const customIcon = new L.Icon({
    iconUrl: customMarkerIcon,
    iconSize: [38, 38], // Adjust the size of the icon
    iconAnchor: [19, 38], // Point of the icon that corresponds to the marker's location
    popupAnchor: [0, -38], // Point from which the popup should open relative to the iconAnchor
});

function Pin({ item }) {
  return (
    <Marker position={[item.latitude, item.longitude]} icon={customIcon} className="marker">
      <Popup>
        <div className="popup-container">
          <img className="popup-img" src={item.images[0]} alt="Property" />
          <div className="popup-text-container">
            <Link to={`/${item.id}`} className="popup-title-link">{item.title}</Link>
            <div className="popup-bed-price">
              <span className="popup-bedroom">{item.bedroom} Bedroom</span>
              <b className="popup-price">₹{item.price}</b>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
