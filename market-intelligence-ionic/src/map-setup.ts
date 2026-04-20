import L from 'leaflet';

const customMarker = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color:#4285F4; width:12px; height:12px; border-radius:50%; border:2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);'></div>",
  iconSize: [15, 15],
  iconAnchor: [7, 7]
});

L.Marker.prototype.options.icon = customMarker;
export default L;