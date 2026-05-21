import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { INotification } from "../../models";
import { NotificationService } from "../../services/notification.service";

@Component({
  selector: "app-notifications",
  standalone: true,
  imports: [],
  templateUrl: "./notifications.component.html",
  styleUrl: "./notifications.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent {
  private notificationService = inject(NotificationService);
  protected notifications = toSignal(
    this.notificationService.notifications$,
    { initialValue: [] as INotification[] },
  );

  dismiss(notification: INotification): void {
    this.notificationService.dismiss(notification);
  }

  getAlertClass(type: string): string {
    const typeMap: { [key: string]: string } = {
      success: "alert-success",
      error: "alert-danger",
      warning: "alert-warning",
      info: "alert-info",
    };
    return typeMap[type] || "alert-info";
  }

  getIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      success: "check-circle",
      error: "exclamation-circle",
      warning: "exclamation-triangle",
      info: "info-circle",
    };
    return iconMap[type] || "info-circle";
  }
}
