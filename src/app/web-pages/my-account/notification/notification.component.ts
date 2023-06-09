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
  readNotifications: any[] = [];
  unread = false;

  constructor(
    private headerService: HeaderService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.getNotifications();
  }

  getNotifications() {
    this.loading = true;
    this.unread = false;
    this.notifications = [];
    this.readNotifications= [];
    this.headerService.notificationList().subscribe((r: any) => {
      if (r.response.notifications.length > 0) {
        r.response.notifications.forEach((msg: any) => {
          if (msg.is_read == 0) {
            this.notifications.push(msg);
          }
          if (msg.is_read == 1) {
            this.readNotifications.push(msg);
          }
        });
      }
      this.loading = false;
    })
  }

  update(id: string) {
    this.loading = true;
    this.headerService.notificationUpdate(id).subscribe((r: any) => {
      if (r.status) {
        this.getNotifications();
        this.loading = false;
      }
    })
  }

}
