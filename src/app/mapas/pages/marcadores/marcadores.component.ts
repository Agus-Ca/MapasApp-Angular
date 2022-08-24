import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import { elementAt } from 'rxjs';
import { MarcadorPersonalizado } from './interfaces/MarcadorPersonalizado.interface';



@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
    .mapa-container {
      width: 100%;
      height: 100%;
    }

    .list-group {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999;
    }

    li {
      cursor: pointer;
    }
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [ number, number ] = [ -68.84456222709373, -32.88968870815972 ];
  marcadores: MarcadorPersonalizado[] = [];
  
  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.leerLocalStorage();

    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'Hola mundo'; 

    // const marker = new mapboxgl.Marker({
    //   element: markerHtml
    // })
    //   .setLngLat( this.center )
    //   .addTo( this.mapa );
  }

  agregarMarcador() {
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color: color
    })
      .setLngLat( this.center )
      .addTo( this.mapa );
    
      this.marcadores.push( 
        { 
          marcador: nuevoMarcador, 
          color: color
        });

    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    });
  }

  irMarcador( marcador: mapboxgl.Marker ): void {
    this.mapa.flyTo(
      {
        center: marcador.getLngLat()
      });
  }

  guardarMarcadoresLocalStorage(): void {
     const lngLatArr: MarcadorPersonalizado[] = [];

    this.marcadores.forEach( marcador => {
      const color = marcador.color;
      const { lng, lat } = marcador.marcador!.getLngLat();
      lngLatArr.push({
        color: color,
        centro: [ lng, lat ]
      })
    })

    localStorage.setItem('marcadores', JSON.stringify( lngLatArr ));
  }

  leerLocalStorage(): void {
    if ( !localStorage.getItem('marcadores') ) {
      return
    } else {
      const lngLatArr: MarcadorPersonalizado[] = JSON.parse(localStorage.getItem('marcadores')! );

      lngLatArr.forEach( marcador => {
        const nuevoMarcador = new mapboxgl.Marker({
          color: marcador.color,
          draggable: true
        })
          .setLngLat( marcador.centro! )
          .addTo( this.mapa );
        
        this.marcadores.push({
          marcador: nuevoMarcador,
          color: marcador.color
        });

        nuevoMarcador.on('dragend', () => {
          this.guardarMarcadoresLocalStorage();
        });
      });
    }
  }

  borrarMarcador( i: number ): void {
    this.marcadores[i].marcador?.remove();
    this.marcadores.splice( i, 1 );
    this.guardarMarcadoresLocalStorage();
  }

}