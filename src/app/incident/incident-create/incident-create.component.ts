import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Office } from '../../models/office/Office';
import { InfoService } from '../../info.service';

import { OrgMapInfo } from '../../models/organization/OrgMapInfo';
import * as maptalks from 'maptalks';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
import { PopupComponent } from '../../popup/popup.component';
@Component({
  selector: 'app-incident-create',
  templateUrl: './incident-create.component.html',
  styleUrls: ['./incident-create.component.css']
})
export class IncidentCreateComponent implements OnInit, AfterViewInit {
  office: Office;
  step = 0;
  organizations: OrgMapInfo[];
  newIncident = {
    id: 'Enter Id',
    name: 'Enter Incident Name',
    type: 'Enter Incient type',
    info: 'Enter Incient info',
    latitude: 0,
    longitude: 0,
  };

  incidents = [];
  map;
  extent;
  center;
  mapStatus;
  constructor(private service: InfoService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.newIncident.latitude = -0.131049;
    this.newIncident.longitude = 51.498568;
    this.newIncident.id = '0';
    this.newIncident.name = 'enter incident name';
    this.newIncident.type = 'enter incident type';
    this.newIncident.info = 'enter incident info';
    this.service.incident.subscribe(res => this.incidents = res);
    this.service.saveIncident(this.incidents);
  }

  ngAfterViewInit() {
    this.loadMap();
  }


  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  saveOffice() {
    console.log(this.office);
  }

  loadMap() {
    const map = new maptalks.Map('map', {
      center: [this.newIncident.latitude, this.newIncident.longitude],
      zoom: 14,
      centerCross: true,
      baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c', 'd'],
        attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
      })
    });
    const ref = this;
    map.on('zoomend moving moveend', getStatus);

    getStatus();

    function getStatus() {
      const extent = map.getExtent(),
        ex = [
          '{',
          'xmin:' + extent.xmin.toFixed(5),
          ', ymin:' + extent.ymin.toFixed(5),
          ', xmax:' + extent.xmax.toFixed(5),
          ', ymax:' + extent.xmax.toFixed(5),
          '}'
        ].join('');
        const center = map.getCenter();
      const mapStatus = [
        'Center : [' + [center.x.toFixed(5), center.y.toFixed(5)].join() + ']',
        'Extent : ' + ex,
        'Size : ' + map.getSize().toArray().join(),
        'Zoom : '   + map.getZoom(),
        'MinZoom : ' + map.getMinZoom(),
        'MaxZoom : ' + map.getMaxZoom(),
        'Projection : ' + map.getProjection().code
      ];
       ref.newIncident.latitude =  parseFloat(center.x.toFixed(4));
       ref.newIncident.longitude = parseFloat(center.y.toFixed(4));
    console.log(mapStatus);
    }

  }

  saveOrg() {
    console.log(this.incidents);
    console.log(this.newIncident);
    this.incidents.push(this.newIncident);
    this.service.saveIncident(this.incidents);
    this.snackBar.openFromComponent( PopupComponent, {
      duration: 1000,
    });
    this.step = 0;
  }

}
