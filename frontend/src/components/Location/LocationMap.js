import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Map, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

//Components

//Icons
import customMarker from "../../public/assets/img/custom_marker.png";

//Static files
import "../../public/css/Location/locationMap.css";
import "leaflet/dist/leaflet.css";

const customIcon = new L.Icon({
  iconUrl: customMarker,
  iconRetinaUrl: customMarker,
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  className: "leaflet-marker-icon",
});

function LocationMap({ placeName }) {
  const [coords, setCoords] = useState({
    lat: 0,
    lng: 0,
  });
  const getCoordinates = async () => {
    try {
      await axios
        .get(`http://localhost:4000/posts/coords/${placeName}`)
        .then((res) => {
          setCoords(res.data.coords);
        })
        .catch((err1) =>
          console.log(`Error al obtener las coordenadas. ${err1}`)
        );
    } catch (err) {
      console.log(
        `Se ha producido un error al obtener la coordenadas de la localización. ${err}`
      );
    }
  };

  useEffect(() => {
    getCoordinates();
  }, []);

  return (
    <div className="map-container">
      <Map center={coords} zoom={10} attributionControl={false} static={true}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={coords} icon={customIcon} />
      </Map>
    </div>
  );
}

export default withRouter(LocationMap);
