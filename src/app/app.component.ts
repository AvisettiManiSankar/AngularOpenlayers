import { Component } from '@angular/core';
import { Map, Tile, View } from 'ol';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import VectorImageLayer from 'ol/layer/VectorImage';
import { Projection } from 'ol/proj';
import { OSM, TileWMS, Vector, XYZ } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Circle from 'ol/style/Circle';
import Style from 'ol/style/Style';
import Overlay from 'ol/Overlay'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'AngularOpenlayers';
  constructor(){

  }

  ngAfterViewInit(){
    // this.example1();
    // this.example2();
    this.example3()
  }

  example3(){
    const map = new Map({
      target: 'main-map',
      view: new View({
        center: [0,0],
        zoom: 2
      })
    })

    // Basemaps
    const openStreetMapStandard = new TileLayer({
      source: new OSM(),
      visible: true,
    })
    openStreetMapStandard.set('title', 'OSMStandard')

    const openStreerMapHumanitarain = new TileLayer({
      source: new OSM({
        url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
      }),
      visible: false,
    })
    openStreerMapHumanitarain.set('title', 'OSMHumanitarain')

    const stamenTerrain = new TileLayer({
      source: new XYZ({
        url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}.png'
      }),
      visible: false,
    })
    stamenTerrain.set('title', 'StamenTerrain')

    // Layer Group
    const baseLayerGroup = new LayerGroup({
      layers: [
        openStreetMapStandard, openStreerMapHumanitarain, stamenTerrain
      ]
    })
    map.addLayer(baseLayerGroup);

    // Layer Switcher Logic for Basemaps
    const fillStyle = new Fill({
      color: [84, 118, 255, 1]
    });
    const strokeStyle =new Stroke({
      color: [46, 45, 45, 1],
      width:1.25
    });
    const circleStyle = new Circle({
      fill: new Fill({
        color: [245, 49, 5, 1]
      }),
      radius: 7,
      stroke: strokeStyle
    })
    const baseLayerElements = document.querySelectorAll('.sidebar > input[type=radio]');
    baseLayerElements.forEach(element=>{
      element.addEventListener('change', function(){
        var radio:any = element;
        baseLayerGroup.getLayers().forEach(layer=>{
          layer.setVisible(radio.value === layer.get('title'))
        })
      })
    })

    const indiaGeoJson = new VectorImageLayer({
      source: new Vector({
        url: 'assets/vectors_data/india.geojson',
        format: new GeoJSON()
      }),
      visible: true,
      style: new Style({
        fill: fillStyle,
        stroke: strokeStyle,
        image: circleStyle
      })
    })
    indiaGeoJson.set('title', 'indiaCities')

    map.addLayer(indiaGeoJson)

    // Vector Feature Popup Logic
    const overlayContainerElement = document.querySelector('.overlay-container')
    if(overlayContainerElement){
      const overlayLayer = new Overlay({
        element: overlayContainerElement as HTMLElement
      })
      map.addOverlay(overlayLayer)
      const overlayFeatureName = document.getElementById('feature-name')
      const overlayFeatureCapital = document.getElementById('feature-capital')
  
      if (overlayFeatureName && overlayFeatureCapital) {
        map.on('click', function(e){
          overlayLayer.setPosition(undefined)
          map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
            let clickedCoordinate = e.coordinate;
            console.log('manimm')
            let clickedFeatureName = feature.get('name');
            let clickedFeatureCapital = feature.get('capital');
            overlayLayer.setPosition(clickedCoordinate);
            overlayFeatureName.innerHTML = clickedFeatureName;
            overlayFeatureCapital.innerHTML = clickedFeatureCapital;
          },
          {
            layerFilter: function(layerCandidate){
              return layerCandidate.get('title') === 'indiaCities'
            }
          })
        })
      }
    }
  }

  example2(){
    const map =new Map({
          layers: [
            new TileLayer({source: new OSM()}),
          ],
          view: new View({
            center: [289643278.95612985, 1883873.8401561074],
            zoom: 14,
            maxZoom:20,
            minZoom:2,
            rotation:0.5
          }),
          target: 'main-map',
        });
    map.on('click', function(e){
    console.log(e.coordinate)
    })
  }

  example1(){
    const map = new Map({
      target: 'map',
      view: new View({
        projection: 'EPSG:3857', // here is the view projection
        center: [0, 0],
        zoom: 2,
      }),
      layers: [
        new TileLayer({
          source: new TileWMS({
            projection: 'EPSG:4326', // here is the source projection
            url: 'https://ahocevar.com/geoserver/wms',
            params: {
              'LAYERS': 'ne:NE1_HR_LC_SR_W_DR',
            },
          }),
        }),
      ],
    });
  }
}
