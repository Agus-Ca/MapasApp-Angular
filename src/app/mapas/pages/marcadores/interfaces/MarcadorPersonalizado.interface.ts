import * as mapboxgl from 'mapbox-gl';



export interface MarcadorPersonalizado {
    color     : string;
    marcador? : mapboxgl.Marker;
    centro?   : [ number, number ];
}