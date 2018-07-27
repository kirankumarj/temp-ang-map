import { Component, OnInit ,  AfterViewChecked, AfterViewInit, ViewChild,ChangeDetectionStrategy} from '@angular/core';
import { InfoService } from '../../info.service';
import { MatTableDataSource, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { OrgMapInfo } from '../../models/organization/OrgMapInfo';
import * as maptalks from 'maptalks';
import { OverlayDeleteComponent } from '../../popup/overlay-delete/overlay-delete.component';
import { OverlayUpdateOrgComponent } from '../../popup/overlay-update-org/overlay-update-org.component';
import { PopupComponent } from '../../popup/popup.component';

import { environment } from '../../../environments/environment';
import { OrganizationService } from '../../services/organization.service';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AppState} from '../../app.state';
import {getAllOrganizations} from '../store/org.reducers';
import * as orgActions from '../store/org.actions';


export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-orgview',
  templateUrl: './orgview.component.html',
  styleUrls: ['./orgview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OrgviewComponent implements OnInit , AfterViewInit {
  isUpdate = false;
  displayLayout = 'none';
  organizationsList: Observable<OrgMapInfo[]>;
  displayedColumns: string[] = ['name', 'type', 'info', 'action'];
  dataSource;
  organization = [];
  mapSelcted = '';
  incidentLocations = [];
  layer;
  map;
  marker;
  orgIndex;
  action;
  address;
  mapUpdate;
  searchAddress;
  filterSize = false;
  displayUpdateVal = 'none';
  displayAllVal = 'block';
  addressInfo;
  elementUpdate;
  extent;
  ex;
  center;
  mapStatus;
  step = 0;
  updateData = {
    id: '',
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
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private service: InfoService, private matDialog: MatDialog, private snackBar: MatSnackBar,
    private organizationService: OrganizationService,
  private store: Store<AppState> ) {
  }

  ngOnInit() {
    // this.store.dispatch(new orgActions.GetAllOrganization() );
    // console.log("From the ngOnInit");
    // console.log(this.store);
  }
  ngAfterViewInit() {
    if (environment.isDataAvailableInRealService) {
      console.log('Hit the service :: Get the all Org Details ');
      this.getAllOrganizations();
    } else {
      console.log('Mock Data :: Get the all Org Details ');
      this.service.mapLocation.subscribe(res => this.organization = res);
      this.service.saveOrganization(this.organization);
      this.dataSource = new MatTableDataSource<OrgMapInfo>(this.organization);
      this.dataSource.paginator = this.paginator;
      this.loadMap();
      this.loadMapUpdate();
    }
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

  locateTheIncident(incident) {
    console.log(incident);
  }
  animateMap(element) {
    console.log(element);
      setTimeout( ( ) => {
        this.map.animateTo({
          center: [element.latitude, element.longitude],
          zoom: 12,
          pitch: 20,
          bearing: 0
        }, {
          duration: 1000
        });
      }, 1000);
    }

  applyMarkers(org) {

    org.forEach(element => {
      this.marker = new maptalks.Marker(
        [element.latitude, element.longitude],
        {
          'properties' : {
            'name' : element.name
          },
          symbol : [
            {
              'markerFile'   : '../../assets/icons/office/office.png',
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
  mapInitialization(lat, lon ) {
    this.map = new maptalks.Map('map', {
      center: [lat, lon],
      zoom: 14,
      baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a', 'b' , 'c' , 'd'],
        attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
      })
    });
  }

  loadMap() {
    const size = this.organization.length - 1;
    if (0 <= size) {
      this.mapInitialization(this.organization[size].latitude, this.organization[size].longitude);
      this.layer = new maptalks.VectorLayer('vector').addTo(this.map);
      this.applyMarkers(this.organization);
    } else {
      window.navigator.geolocation.getCurrentPosition((location) => {
        this.mapInitialization(location.coords.longitude, location.coords.latitude);
        });
    }
  }

  updateRecord(element) {
    this.displayLayout = 'block';
    this.isUpdate = true;
    this.displayUpdateVal = 'block';
    this.displayAllVal = 'none';

    this.updateData.name = element.name;
    this.updateData.type = element.type;
    this.updateData.info = element.info;
    this.updateData.id = element.id;
    this.updateData.latitude = element.latitude;
    this.updateData.longitude = element.longitude;

    this.elementUpdate = element;

    this.service.getMapLocationDataByLL(this.updateData.latitude, this.updateData.longitude).
     subscribe((res) => {
         this.displayLayout = 'none';
          this.addressInfo = res;
          this.mapValues(this, this.addressInfo, this.updateData.address);
          this.moveMap(this.addressInfo);
      });
  }

  deleteRecord(element) {
    console.log(element);
    this.orgIndex = this.organization.indexOf(element);
    this.openDialog(element);
  }

  openDialog(element): void {
    const dialogRef = this.matDialog.open(OverlayDeleteComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        if (this.orgIndex !== -1) {
          if (environment.isDataAvailableInRealService) {
            this.organizationService.deleteOrganization(element.id).subscribe((res) => {
              console.log(res);
              if ( res.deleted === 1 ) {
                this.organization.splice(this.orgIndex, 1);
                this.dataSource = new MatTableDataSource<OrgMapInfo>(this.organization);
                this.map.removeLayer(this.layer);
                this.layer = new maptalks.VectorLayer('vector').addTo(this.map);
                this.applyMarkers(this.organization);
                this.snackBar.openFromComponent(PopupComponent, {
                  duration: 1000,
                  data: 'Record Deleted...!'
                });
              }
            },
            error => {
              this.snackBar.openFromComponent(PopupComponent, {
                duration: 2000,
                data: 'Service Error...!'
              });
            });

          } else {
            this.organization.splice(this.orgIndex, 1);
            this.service.saveOrganization(this.organization);
            this.dataSource = new MatTableDataSource<OrgMapInfo>(this.organization);
            this.map.removeLayer(this.layer);
            this.layer = new maptalks.VectorLayer('vector').addTo(this.map);
            this.applyMarkers(this.organization);
          }
        }
      }
    });
  }

  getAllOrganizations() {
    // console.log("Before selecting getAllOrganization store....");
    // this.organizationsList = this.store.select(getAllOrganizations);
    // console.log("After selecting getAllOrganization store....");
    // console.log(this.organizationsList);
//   this.store.dispatch(new orgActions.GetAllOrganization() );


    this.organizationService.getAllOrganizations().subscribe((res) => {
      this.organization = res;
      console.log(this.organization);
      this.dataSource = new MatTableDataSource<OrgMapInfo>(this.organization);
      this.dataSource.paginator = this.paginator;
      this.loadMap();
    },
    error => {
      this.snackBar.openFromComponent(PopupComponent, {
        duration: 3000,
        data: 'Service Error...!'
      });
    });
  }

  updateOrganization(element) {
    this.displayLayout = 'block';
    console.log('req', this.updateData);
    if (environment.isDataAvailableInRealService) {
          this.organizationService.updateOrganization(this.updateData).subscribe((res) => {
            console.log(res);
            if ( res.id === this.updateData.id ) {
                element.name = this.updateData.name;
                element.type = this.updateData.type;
                element.info = this.updateData.info;
                this.snackBar.openFromComponent(PopupComponent, {
                  duration: 1000,
                  data: 'Record Updated...!'
                });
                this.map.removeLayer(this.layer);
                this.layer = new maptalks.VectorLayer('vector').addTo(this.map);
                this.applyMarkers(this.dataSource.filteredData);
            }
          },
          error => {
            this.snackBar.openFromComponent(PopupComponent, {
              duration: 2000,
              data: 'Service Error...!'
            });
          });
    } else {
      // element.name = this.updateData.name;
      // element.type = this.updateData.type;
      // element.info = this.updateData.info;
      // element.latitude = this.updateData.latitude;
      // element.longitude = this.updateData.longitude;
      // this.map.removeLayer(this.layer);
      // this.layer = new maptalks.VectorLayer('vector').addTo(this.map);
      // this.applyMarkers(this.organization);
      // this.snackBar.openFromComponent(PopupComponent, {
      //   duration: 2000,
      //   data: 'Updated Data...!'
      // });
          this.elementUpdate.name = this.updateData.name;
          this.elementUpdate.tyep = this.updateData.type;
          this.elementUpdate.info = this.updateData.info;
          this.elementUpdate.latitude = this.updateData.latitude;
          this.elementUpdate.longitude = this.updateData.longitude;
          this.elementUpdate.addres = this.updateData.address;
          // this.elementUpdate = this.updateData;
          this.snackBar.openFromComponent(PopupComponent, {
            duration: 1000,
            data: 'Updated Data...!'
          });
          this.map.removeLayer(this.layer);
          this.layer = new maptalks.VectorLayer('vector').addTo(this.map);
          this.applyMarkers(this.dataSource.filteredData);
          this.animateMap(element);
    }
  }

  filterOrgInfo(value) {
          this.dataSource.filter = value.trim().toLowerCase();
          this.map.removeLayer(this.layer);
          this.layer = new maptalks.VectorLayer('vector').addTo(this.map);
          this.applyMarkers(this.dataSource.filteredData);
          if (this.dataSource.filteredData.length === 0) {
            this.filterSize = true;
          } else {
            this.filterSize = false;
          }
  }

  deleteOrganization(element) {
  }

  searchMapLocationBySearchData() {
    this.service.getMapLocationData(this.searchAddress).subscribe((res) => {
      this.address = res;
    });
  }

  moveMap(addresDetails) {
    this.updateData.latitude =  parseFloat(addresDetails.lon);
    this.updateData.longitude = parseFloat(addresDetails.lat);
    this.mapUpdate.remove();
    this.loadMapUpdate();
    this.mapValues(this, addresDetails, this.updateData.address);
    this.address = [];
  }

  loadMapUpdate() {
   this.mapUpdate = new maptalks.Map('mapUpdate', {
      center: [this.updateData.latitude, this.updateData.longitude],
      zoom: 13,
      centerCross: true,
      zoomControl: {
        'position'  : 'top-right'
      },
      baseLayer: new maptalks.TileLayer('base', {
      urlTemplate: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      subdomains: ['a', 'b' , 'c'],
      attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
    })
    });
    const refUpdate = this;
    this.mapUpdate.on('zoomend moveend', getStatus);
  function getStatus() {
    refUpdate.addressInfo = '';
    refUpdate.searchAddress = '';
    refUpdate.updateData.address.city = '';
    refUpdate.updateData.address.state = '';
    refUpdate.updateData.address.postcode = '';
    refUpdate.updateData.address.country = '';
    refUpdate.updateData.address.state_district = '';
    refUpdate.extent = refUpdate.map.getExtent(),
    refUpdate.ex = [
        '{',
        'xmin:' + refUpdate.extent.xmin.toFixed(5),
        ', ymin:' + refUpdate.extent.ymin.toFixed(5),
        ', xmax:' + refUpdate.extent.xmax.toFixed(5),
        ', ymax:' + refUpdate.extent.xmax.toFixed(5),
        '}'
      ].join('');
      refUpdate.center = refUpdate.mapUpdate.getCenter();
      refUpdate.mapStatus = [
      'Center : [' + [refUpdate.center.x.toFixed(5), refUpdate.center.y.toFixed(5)].join() + ']',
      'Extent : ' + refUpdate.ex,
      'Size : ' + refUpdate.mapUpdate.getSize().toArray().join(),
      'Zoom : '   + refUpdate.mapUpdate.getZoom(),
      'MinZoom : ' + refUpdate.mapUpdate.getMinZoom(),
      'MaxZoom : ' + refUpdate.mapUpdate.getMaxZoom(),
      'Projection : ' + refUpdate.mapUpdate.getProjection().code
    ];
    refUpdate.updateData.latitude =  parseFloat(refUpdate.center.x.toFixed(5));
    refUpdate.updateData.longitude = parseFloat(refUpdate.center.y.toFixed(5));
    refUpdate.service.getMapLocationDataByLL(refUpdate.updateData.latitude, refUpdate.updateData.longitude).
     subscribe((res) => {
      refUpdate.addressInfo = res;
      refUpdate.mapValues(refUpdate, refUpdate.addressInfo, refUpdate.updateData.address);
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
  }

  updateCancel() {
    this.displayAllVal = 'block';
    this.displayUpdateVal = 'none';
  }

  updateOrg() {
    this.displayAllVal = 'block';
    this.displayUpdateVal = 'none';
    this.updateOrganization(this.updateData);
  }
}
