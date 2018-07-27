import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-overlay-update-org',
  templateUrl: './overlay-update-org.component.html',
  styleUrls: ['./overlay-update-org.component.css']
})
export class OverlayUpdateOrgComponent implements OnInit {
  orgDetails = {
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
    if ( data ) {
      this.orgDetails = data.updateData;
      this.orgDetails.id = data.actualData.id;
      this.orgDetails.name = data.actualData.name;
      this.orgDetails.type = data.actualData.type;
      this.orgDetails.info = data.actualData.info;
      this.orgDetails.latitude = data.actualData.latitude;
      this.orgDetails.longitude = data.actualData.longitude;
      this.orgDetails.address = data.actualData.address;
    }
  }
  ngOnInit() {
  }

}
