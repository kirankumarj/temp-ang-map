import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FUNCTION_TYPE } from '@angular/compiler/src/output/output_ast';
import { InfoService } from '../info.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { OrgMapInfo } from '../models/organization/OrgMapInfo';
import * as maptalks from 'maptalks';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['id', 'name', 'type', 'info'];
  dataSource;
  incidents;
  mapSelcted = '';
  incidentLocations = [];
  layer;
  map;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private service: InfoService) {
  }

  ngOnInit() {
    this.service.incident.subscribe(res => this.incidents = res);
    this.service.saveIncident(this.incidents);

    this.dataSource = new MatTableDataSource<OrgMapInfo>(this.incidents);
    this.dataSource.paginator = this.paginator;
  }
  ngAfterViewInit() {
    this.loadMap();
  }
  locateTheIncident(incident) {
    console.log(incident);
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

  applyMarkers(incident) {
    let marker;
    incident.forEach(element => {
      marker = new maptalks.Marker(
        [element.latitude, element.longitude],
        {
          'properties' : {
            'name' : element.name
          },
          symbol : [
            {
              'markerFile'   : '../../assets/icons/incident/incident1.png',
              'markerWidth'  : 28,
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
    });

  }

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
   this.mapInitialization();
    const ref  = this;

    this.layer = new maptalks.VectorLayer('vector').addTo(this.map);
    this.applyMarkers(this.incidents);

    // vertical one on top right
    new maptalks.control.Toolbar({
      'vertical' : true,
      'position' : 'top-right',
      'items'     : [{
        item: 'Incidents',
        // click : function () { info('menu'); },
        children : [{
          item: 'Accidents',
          click : function () {
            ref.mapSelcted = 'accident';
            ref.dataSource.filter = ref.mapSelcted.trim().toLowerCase();
            ref.map.removeLayer(ref.layer);
            ref.layer = new maptalks.VectorLayer('vector').addTo(ref.map);
            ref.applyMarkers(ref.dataSource.filteredData);
           }
        }, {
          item: 'Fires',
          click : function () {
            ref.mapSelcted = 'fire';
            ref.dataSource.filter = ref.mapSelcted.trim().toLowerCase();
            ref.map.removeLayer(ref.layer);
            ref.layer = new maptalks.VectorLayer('vector').addTo(ref.map);
            ref.applyMarkers(ref.dataSource.filteredData);
          }
        }, {
            item: 'all',
            click : function () {
              ref.mapSelcted = '';
              ref.dataSource.filter = ref.mapSelcted.trim().toLowerCase();
              ref.map.removeLayer(ref.layer);
            ref.layer = new maptalks.VectorLayer('vector').addTo(ref.map);
            ref.applyMarkers(ref.incidents);
            }
        }]
      }, {
        item: '---',
        click : function () { ref.mapSelcted = 'fire'; }
      }]
    })
    .addTo(this.map);

  }
}
