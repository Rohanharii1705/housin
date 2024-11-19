import { MapContainer, TileLayer } from 'react-leaflet';
import Pin from '../Pin/Pin';
import './Map.css';

function Map({ items }) {
  const centerCoordinates = items.length === 1 
    ? [items[0].latitude, items[0].longitude] 
    : [10.0261, 76.3125]; // Default center

  return (
    <MapContainer center={centerCoordinates} zoom={7} scrollWheelZoom={false} className="Map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((item) => (
        <Pin item={item} key={item.id} />
      ))}
    </MapContainer>
  );
}

export default Map;
