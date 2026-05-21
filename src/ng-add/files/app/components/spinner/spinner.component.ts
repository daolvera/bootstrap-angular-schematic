import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { SpinnerService } from "../../services/spinner.service";

@Component({
  selector: "app-spinner",
  standalone: true,
  imports: [],
  templateUrl: "./spinner.component.html",
  styleUrl: "./spinner.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  private spinnerService = inject(SpinnerService);
  protected isLoading = toSignal(this.spinnerService.isLoading$, {
    initialValue: false,
  });
  protected message = toSignal(this.spinnerService.message$, {
    initialValue: "",
  });
}
