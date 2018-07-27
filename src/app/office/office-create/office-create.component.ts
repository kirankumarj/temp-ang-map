import { Component, OnInit, AfterViewInit } from '@angular/core';
import { InfoService } from '../../info.service';
import { Office } from '../../models/office/Office';

import * as maptalks from 'maptalks';

@Component({
  selector: 'app-office-create',
  templateUrl: './office-create.component.html',
  styleUrls: ['./office-create.component.css']
})
export class OfficeCreateComponent implements OnInit, AfterViewInit {

  step = 0;
  offices: Office[];
  office = {
    id: 'Enter Id',
    name: 'Enter Name',
    latitude: 0,
    longitude: 0,
    type: 'office'
  };
  constructor(private service: InfoService) { }

  ngOnInit() {
    this.office.latitude = -0.131049;
    this.office.longitude = 51.498568;
    this.office.id = '0';
    this.office.name = 'enter Office name';
    this.service.office.subscribe(res => this.offices = res);
    this.service.saveOffice(this.offices);
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
      center: [this.office.latitude, this.office.longitude],
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
       ref.office.latitude =  parseFloat(center.x.toFixed(5));
       ref.office.longitude = parseFloat(center.y.toFixed(5));
    console.log(mapStatus);
    }

  }

  saveOrg() {
    console.log(this.office);
    this.offices.push(this.office);
    this.service.saveOffice(this.offices);
  }

}
