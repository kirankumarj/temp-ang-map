import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Office } from '../../models/office/Office';
import { InfoService } from '../../info.service';
import { OrgMapInfo } from '../../models/organization/OrgMapInfo';
import { MatSnackBar } from '@angular/material';

import * as maptalks from 'maptalks';
import { PopupComponent } from '../../popup/popup.component';
import { OrganizationService } from '../../services/organization.service';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';
import { AddOrganization } from '../store/org.actions';



@Component({
  selector: 'app-orgcreate',
  templateUrl: './orgcreate.component.html',
  styleUrls: ['./orgcreate.component.css']
})

export class OrgcreateComponent implements OnInit, AfterViewInit {
  office: Office;
  step = 0;
  searchAddress;
  organizations: OrgMapInfo[];
  address;
  map;
  extent;
  ex;
  mapStatus;
  center;
  addressInfo;
  addressLocation = [];
  newOrg = {
    name: '',
    latitude: 0,
    longitude: 0,
    type: '',
    info: '',
    address: {
      city: '',
      country: '',
      postcode: '',
      state: '',
      state_district: ''
    }
  };

  organizationsList = [];
  constructor(private service: InfoService, private snackBar: MatSnackBar,
    private organizationService: OrganizationService ,
    private store: Store<AppState>
) { }

  ngOnInit() {
    this.newOrg.latitude = 78.498;
    this.newOrg.longitude = 17.476;
    if (environment.isDataAvailableInRealService) {
      console.log('Hit the service :: Get the all Org Details ');
      this.getAllOrganizations();
    } else {
      console.log('Mock Data :: Get the all Org Details ');
      this.service.mapLocation.subscribe(res => this.organizationsList = res);
      this.service.saveOrganization(this.organizationsList);
    }
  }

  ngAfterViewInit() {
    window.navigator.geolocation.getCurrentPosition((location) => {
        this.newOrg.latitude = location.coords.longitude;
        this.newOrg.longitude  = location.coords.latitude;
        this.loadMap();
        }
    );
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
  }

  loadMap() {
    this.map = new maptalks.Map('map', {
      center: [this.newOrg.latitude, this.newOrg.longitude],
      zoom: 12,
      centerCross: true,
      zoomControl: {
        'position'  : 'top-right'
      },
      baseLayer: new maptalks.TileLayer('base', {
      //   urlTemplate: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      //   subdomains: ['a', 'b' , 'c' , 'd'],
      //   attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
      urlTemplate: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      subdomains: ['a', 'b' , 'c'],
      attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
    })
    });
    const ref = this;
    this.map.on('zoomend moveend', getStatus);
  function getStatus() {
          ref.addressInfo = '';
          ref.step = 2;
          ref.searchAddress = '';
          ref.newOrg.address.city = '';
          ref.newOrg.address.state = '';
          ref.newOrg.address.postcode = '';
          ref.newOrg.address.country = '';
          ref.newOrg.address.state_district = '';
      ref.extent = ref.map.getExtent(),
      ref.ex = [
        '{',
        'xmin:' + ref.extent.xmin.toFixed(5),
        ', ymin:' + ref.extent.ymin.toFixed(5),
        ', xmax:' + ref.extent.xmax.toFixed(5),
        ', ymax:' + ref.extent.xmax.toFixed(5),
        '}'
      ].join('');
      ref.center = ref.map.getCenter();
      ref.mapStatus = [
      'Center : [' + [ref.center.x.toFixed(5), ref.center.y.toFixed(5)].join() + ']',
      'Extent : ' + ref.ex,
      'Size : ' + ref.map.getSize().toArray().join(),
      'Zoom : '   + ref.map.getZoom(),
      'MinZoom : ' + ref.map.getMinZoom(),
      'MaxZoom : ' + ref.map.getMaxZoom(),
      'Projection : ' + ref.map.getProjection().code
    ];
     ref.newOrg.latitude =  parseFloat(ref.center.x.toFixed(5));
     ref.newOrg.longitude = parseFloat(ref.center.y.toFixed(5));
     ref.service.getMapLocationDataByLL(ref.newOrg.latitude, ref.newOrg.longitude).
     subscribe((res) => {
          ref.addressInfo = res;
          ref.mapValues(ref, ref.addressInfo, ref.newOrg.address);
      });
  }
}

mapValues(ref, fromAddress, toAddress) {
    ref.searchAddress = fromAddress.display_name;
    toAddress.city = fromAddress.address.city;
    toAddress.state = fromAddress.address.state;
    toAddress.postcode = fromAddress.address.postcode;
    toAddress.country = fromAddress.address.country;
    toAddress.state_district = fromAddress.address.state_district;
    ref.step = 2;
}
  moveMap(addresDetails) {
    this.newOrg.latitude =  parseFloat(addresDetails.lon);
    this.newOrg.longitude = parseFloat(addresDetails.lat);
    this.map.remove();
    this.loadMap();
    this.mapValues(this, addresDetails, this.newOrg.address);
    this.address = [];
  }

  saveOrg() {
    if (environment.isDataAvailableInRealService) {
      console.log('Hit Service:: Create Org ', this.newOrg);
      this.createOrganization();
    } else {
      console.log('Mock Data :: Create Org ', this.newOrg);
        this.organizationsList.push(this.newOrg);
        this.service.saveOrganization(this.organizationsList);
        this.snackBar.openFromComponent(PopupComponent, {
        duration: 1000,
        data: 'Saved Data...!'
      });
    this.step = 0;
    }
  }

  searchMapLocationBySearchData() {
    this.service.getMapLocationData(this.searchAddress).subscribe((res) => {
      this.address = res;
    });
  }

  createOrganization() {
    this.store.dispatch(new AddOrganization(this.newOrg));

    // this.organizationService.createOrganization(this.newOrg).subscribe((res) => {
    //   console.log(res);
    //   if ( res.id ) {
    //     this.snackBar.openFromComponent(PopupComponent, {
    //       duration: 1000,
    //       data: 'Saved Data...!'
    //     });
    //     this.step = 0;
    //     this.newOrg.name = '';
    //     this.newOrg.type = '';
    //     this.newOrg.info = '';
    //   }
    // },
    // error => {
    //   this.snackBar.openFromComponent(PopupComponent, {
    //     duration: 2000,
    //     data: 'Service Error...!'
    //   });
    //   this.step = 0;
    // });
  }

  getAllOrganizations() {
    this.organizationService.getAllOrganizations().subscribe((res) => {
      this.organizationsList = res;
      console.log(this.organizationsList);
    },
    error => {
      this.snackBar.openFromComponent(PopupComponent, {
        duration: 3000,
        data: 'Service Error...!'
      });
      this.step = 0;
    });
  }
}
