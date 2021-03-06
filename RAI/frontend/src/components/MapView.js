import React, {Component} from 'react';
import {Map, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Markers from './VenueMarkers';
import {useState, useEffect} from 'react';

/*const [data, setData] = useState([]);
useEffect(function(){
    const getData = async function(){
        const res = await fetch("http://46.164.31.241:8080/cesta");
        const data = await res.json();
        setData(data);
    }
    getData();
}, []);*/

var data = "";

class MapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLocation: [46.15, 14.52834872447777], // EDIT coordinates to re-center map
            zoom: 9,  // EDIT from 1 (zoomed out) to 18 (zoomed in)
            preferCanvas: true
        }
    }

    render() {
        const queryParams = new URLSearchParams(window.location.search)
        const indexFromURL = queryParams.get("id")
        const {currentLocation, zoom} = this.state;
        console.log(indexFromURL);
        return (
            indexFromURL != undefined ? 
            <Map center={currentLocation} zoom={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <Markers venues={indexFromURL} />             
            </Map>
:             
<h1>Zadnja pot.
<Map center={currentLocation} zoom={zoom}>
    <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
    />
    <Markers venues={indexFromURL} />             
</Map></h1>

        );
    }
}

export default MapView;
