import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  loading = false;
  notifications: any[] = [];

  constructor(
    private headerService: HeaderService,
    private alert: AlertService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.getNotifications();
  }

  getNotifications() {
    this.headerService.notificationList().subscribe((r: any) => {
      this.notifications = r.response.notifications;
      this.loading = false;
    })
  }

  update(id: string) {
    this.loading = true;
    this.headerService.notificationUpdate(id).subscribe((r: any) => {
      if (r.status) {
        this.alert.fireToastS('Marked as read');
      }
    })
  }

}
