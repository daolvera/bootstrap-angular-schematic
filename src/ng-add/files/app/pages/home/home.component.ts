import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { SampleModalComponent } from "../../components/sample-modal/sample-modal.component";
import { ThemeToggleComponent } from "../../components/theme-toggle/theme-toggle.component";
import { ModalService } from "../../services/modal.service";
import { NotificationService } from "../../services/notification.service";
import { SpinnerService } from "../../services/spinner.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [ThemeToggleComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private spinnerService = inject(SpinnerService);
  private modalService = inject(ModalService);
  private notificationService = inject(NotificationService);

  showSpinner(): void {
    this.spinnerService.show("Processing...");
    setTimeout(() => {
      this.spinnerService.hide();
      this.notificationService.success("Operation completed successfully!");
    }, 2000);
  }

  openModal(): void {
    const modalRef = this.modalService.open(SampleModalComponent, {
      title: "Sample Modal",
      size: "lg",
      centered: true,
    });

    modalRef.result.then(
      (result: any) => {
        this.notificationService.info(`Modal closed with: ${result}`);
      },
      (reason: any) => {
        this.notificationService.warning("Modal dismissed");
      },
    );
  }

  showNotification(type: "success" | "error" | "warning" | "info"): void {
    const messages = {
      success: "This is a success message!",
      error: "This is an error message!",
      warning: "This is a warning message!",
      info: "This is an info message!",
    };

    this.notificationService[type](messages[type]);
  }
}
