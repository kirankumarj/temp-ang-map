import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FUNCTION_TYPE } from '@angular/compiler/src/output/output_ast';
import { InfoService } from '../../info.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { OrgMapInfo } from '../../models/organization/OrgMapInfo';

import * as maptalks from 'maptalks';

@Component({
  selector: 'app-office-view',
  templateUrl: './office-view.component.html',
  styleUrls: ['./office-view.component.css']
})
export class OfficeViewComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['id', 'name', 'type', 'info'];
  dataSource;
  offices;
  mapSelcted = '';
  incidentLocations = [];
  layer;
  map;
  marker;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private service: InfoService) {
  }

  ngOnInit() {
    this.service.office.subscribe(res => this.offices = res);
    this.service.saveOffice(this.offices);

    this.dataSource = new MatTableDataSource<OrgMapInfo>(this.offices);
    this.dataSource.paginator = this.paginator;
  }
  ngAfterViewInit() {
    this.loadMap();
  }
  locateTheIncident(office) {
    console.log(office);
  }
  animateMap(element) {
    console.log(element);
      setTimeout( ( ) => {
        this.map.animateTo({
          center: [element.latitude, element.longitude],
          zoom: 14,
          pitch: 40,
          bearing: 180
        }, {
          duration: 1000
        });
      }, 1000);
    }

  applyMarkers(office) {

    office.forEach(element => {
      this.marker = new maptalks.Marker(
        [element.latitude, element.longitude],
        {
          'properties' : {
            'name' : element.name
          },
          symbol : [
            {
              'markerFile'   : '../../assets/icons/incident/' + element.type + '.png',
              'markerWidth'  : 30,
              'markerHeight' : 40
            },
            {
              'textFaceName' : 'sans-serif',
              'textName' : '{name}',
              'textSize' : 14,
              'textDy'   : 24
            }
          ]
        }
      ).addTo(this.layer);
      this.marker.setInfoWindow({
        'title'     : element.name,
        'content'   : element.info
      });
      this.marker.openInfoWindow();
    });
  }
// map initializations
  mapInitialization() {
    this.map = new maptalks.Map('map', {
      center: [-0.113049, 51.498568],
      zoom: 14,
      baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c', 'd'],
        attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
      })
    });
  }
  loadMap() {
    const mapJSON = {
      'version': '1.0',
      'options': {
      'center': { 'x': -0.113049, 'y': 51.49856800000001 },
      'zoom': 13
      },
      'baseLayer': {
      'type': 'TileLayer',
      'id': 'base',
      'options': {
      'urlTemplate': 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      'subdomains': ['a', 'b', 'c']
      }
      },
      'layers': [
      {
      'type': 'VectorLayer',
      'id': 'v',
      'geometries': [
      {
      'feature': {
      'type': 'Feature',
      'geometry': {
      'type': 'Point',
      'coordinates': [-0.113049, 51.498568]
      }
      }
      }
      ]
      }
      ]
      };

    maptalks.Map.fromJSON('map', mapJSON);

  }

  // loadMap() {
  //  this.mapInitialization();
  //   let ref  = this;

  //   this.layer = new maptalks.VectorLayer('vector').addTo(this.map);
  //   this.applyMarkers(this.offices);

  //   // vertical one on top right
  //   new maptalks.control.Toolbar({
  //     'vertical' : true,
  //     'position' : 'top-right',
  //     'items'     : [{
  //       item: 'Incidents',
  //       click : function () { info('menu'); },
  //       children : [{
  //         item: 'Accidents',
  //         click : function () {
  //           ref.mapSelcted = 'accident';
  //           ref.dataSource.filter = ref.mapSelcted.trim().toLowerCase();
  //           ref.map.removeLayer(ref.layer);
  //           ref.layer = new maptalks.VectorLayer('vector').addTo(ref.map);
  //           ref.applyMarkers(ref.dataSource.filteredData);
  //          }
  //       }, {
  //         item: 'Fires',
  //         click : function () {
  //           ref.mapSelcted = 'fire';
  //           ref.dataSource.filter = ref.mapSelcted.trim().toLowerCase();
  //           ref.map.removeLayer(ref.layer);
  //           ref.layer = new maptalks.VectorLayer('vector').addTo(ref.map);
  //           ref.applyMarkers(ref.dataSource.filteredData);
  //         }
  //       }, {
  //         item: 'Earthquake',
  //         click : function () {
  //           ref.mapSelcted = 'earthquake';
  //           ref.dataSource.filter = ref.mapSelcted.trim().toLowerCase();
  //           ref.map.removeLayer(ref.layer);
  //           ref.layer = new maptalks.VectorLayer('vector').addTo(ref.map);
  //           ref.applyMarkers(ref.dataSource.filteredData);
  //         }
  //       }, {
  //         item: 'Floods',
  //         click : function () {
  //           ref.mapSelcted = 'floods';
  //           ref.dataSource.filter = ref.mapSelcted.trim().toLowerCase();
  //           ref.map.removeLayer(ref.layer);
  //           ref.layer = new maptalks.VectorLayer('vector').addTo(ref.map);
  //           ref.applyMarkers(ref.dataSource.filteredData);
  //         }
  //       }, {
  //           item: 'all',
  //           click : function () {
  //             ref.mapSelcted = '';
  //             ref.dataSource.filter = ref.mapSelcted.trim().toLowerCase();
  //             ref.map.removeLayer(ref.layer);
  //           ref.layer = new maptalks.VectorLayer('vector').addTo(ref.map);
  //           ref.applyMarkers(ref.incidents);
  //           }
  //       }]
  //     }, {
  //       item: '---',
  //       click : function () { ref.mapSelcted = 'fire'; }
  //     }]
  //   })
  //   .addTo(this.map);

  // }
}
