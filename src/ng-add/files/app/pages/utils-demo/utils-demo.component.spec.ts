import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../../services/notification.service";
import { UtilsDemoComponent } from "./utils-demo.component";

describe("UtilsDemoComponent", () => {
  let component: UtilsDemoComponent;
  let fixture: ComponentFixture<UtilsDemoComponent>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const notificationSpy = jasmine.createSpyObj("NotificationService", [
      "success",
      "error",
      "warning",
      "info",
    ]);

    await TestBed.configureTestingModule({
      imports: [UtilsDemoComponent, ReactiveFormsModule],
      providers: [{ provide: NotificationService, useValue: notificationSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilsDemoComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(
      NotificationService,
    ) as jasmine.SpyObj<NotificationService>;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize registration form with validators", () => {
    expect(component.registrationForm).toBeDefined();
    expect(component.registrationForm.get("username")).toBeDefined();
    expect(component.registrationForm.get("email")).toBeDefined();
    expect(component.registrationForm.get("password")).toBeDefined();
    expect(component.registrationForm.get("confirmPassword")).toBeDefined();
  });

  it("should initialize login form", () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get("email")).toBeDefined();
    expect(component.loginForm.get("password")).toBeDefined();
  });

  it("should mark form as touched and show error when registration form is invalid", () => {
    component.onRegistrationSubmit();
    expect(component.registrationForm.get("username")?.touched).toBe(true);
    expect(notificationService.error).toHaveBeenCalled();
  });

  it("should show success notification when registration form is valid", () => {
    component.registrationForm.patchValue({
      username: "testuser",
      email: "test@example.com",
      phone: "123-456-7890",
      password: "Test@1234",
      confirmPassword: "Test@1234",
      website: "https://example.com",
    });

    component.onRegistrationSubmit();
    expect(notificationService.success).toHaveBeenCalled();
  });

  it("should reset registration form", () => {
    component.registrationForm.patchValue({
      username: "testuser",
      email: "test@example.com",
    });

    component.resetRegistrationForm();
    expect(component.registrationForm.get("username")?.value).toBeNull();
    expect(component.formErrors).toEqual({});
  });

  it("should reset login form", () => {
    component.loginForm.patchValue({
      email: "test@example.com",
      password: "password123",
    });

    component.resetLoginForm();
    expect(component.loginForm.get("email")?.value).toBeNull();
  });

  it("should detect field errors correctly", () => {
    const usernameControl = component.registrationForm.get("username");
    usernameControl?.markAsTouched();
    usernameControl?.setValue("");

    const hasError = component.hasError(
      component.registrationForm,
      "username",
      "required",
    );
    expect(hasError).toBe(true);
  });
});
