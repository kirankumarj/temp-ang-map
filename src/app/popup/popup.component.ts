import { Component, OnInit, Inject } from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  message;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    console.log(data);
    if ( data ) {
      this.message = data;
    }
  }

  ngOnInit() {
  }

}
