import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl'



@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [
    `
      #mapa {
        width: 100%;
        height: 100%;
      }
    `
  ]
})
export class FullScreenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    var map = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [ -68.84456222709373, -32.88968870815972 ],
      zoom: 17
    });

  }

}