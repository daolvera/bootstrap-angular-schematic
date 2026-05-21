import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-sample-modal",
  standalone: true,
  imports: [],
  templateUrl: "./sample-modal.component.html",
  styleUrl: "./sample-modal.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleModalComponent {
  protected activeModal = inject(NgbActiveModal);
  title: string = "Sample Modal";

  confirm(): void {
    this.activeModal.close("Confirmed");
  }

  cancel(): void {
    this.activeModal.dismiss("Cancelled");
  }
}
