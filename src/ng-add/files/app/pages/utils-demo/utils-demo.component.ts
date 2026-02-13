import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { NotificationService } from "../../services/notification.service";
import { FormUtils } from "../../utils/form-utils";
import { CustomValidators } from "../../utils/validators";

@Component({
  selector: "app-utils-demo",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./utils-demo.component.html",
  styleUrls: ["./utils-demo.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UtilsDemoComponent {
  registrationForm: FormGroup;
  loginForm: FormGroup;
  formErrors: { [key: string]: string[] } = {};

  // Expose Object to template
  protected readonly Object = Object;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
  ) {
    this.registrationForm = this.createRegistrationForm();
    this.loginForm = this.createLoginForm();
  }

  private createRegistrationForm(): FormGroup {
    return this.fb.group({
      username: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [CustomValidators.phoneNumber()]],
      password: ["", [Validators.required, CustomValidators.strongPassword()]],
      confirmPassword: [
        "",
        [Validators.required, CustomValidators.matchesField("password")],
      ],
      website: ["", [CustomValidators.url()]],
    });
  }

  private createLoginForm(): FormGroup {
    return this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  onRegistrationSubmit(): void {
    if (this.registrationForm.invalid) {
      FormUtils.markAllAsTouched(this.registrationForm);
      this.formErrors = FormUtils.getAllErrors(this.registrationForm);
      this.notificationService.error(
        "Please fix validation errors before submitting!",
      );
      return;
    }

    this.notificationService.success(
      "Registration form is valid! (Demo only - not submitted)",
    );
    console.log("Registration Form Values:", this.registrationForm.value);
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      FormUtils.markAllAsTouched(this.loginForm);
      this.notificationService.error("Please fill in all required fields!");
      return;
    }

    this.notificationService.success(
      "Login form is valid! (Demo only - not submitted)",
    );
    console.log("Login Form Values:", this.loginForm.value);
  }

  resetRegistrationForm(): void {
    this.registrationForm.reset();
    this.formErrors = {};
  }

  resetLoginForm(): void {
    this.loginForm.reset();
  }

  showAllErrors(): void {
    this.formErrors = FormUtils.getAllErrors(this.registrationForm);
    console.log("All Form Errors:", this.formErrors);

    if (Object.keys(this.formErrors).length === 0) {
      this.notificationService.info("No validation errors found!");
    } else {
      this.notificationService.warning(
        `Found ${Object.keys(this.formErrors).length} fields with errors. Check console for details.`,
      );
    }
  }

  hasError(form: FormGroup, field: string, error: string): boolean {
    const control = form.get(field);
    return !!(control && control.hasError(error) && control.touched);
  }

  getErrorMessage(field: string, errorKey: string): string {
    const control = this.registrationForm.get(field);
    if (!control) return "";
    const errorValue = control.errors?.[errorKey];
    return FormUtils.getErrorMessage(field, errorKey, errorValue);
  }
}
