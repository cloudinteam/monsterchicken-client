import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'location-allow',
  templateUrl: './location-allow.component.html',
  styleUrls: ['./location-allow.component.scss']
})
export class LocationAllowComponent {

  constructor(
    private dialog: DynamicDialogRef
  ) { }

  closeBlocker() {
    this.dialog.close();
  }

}
