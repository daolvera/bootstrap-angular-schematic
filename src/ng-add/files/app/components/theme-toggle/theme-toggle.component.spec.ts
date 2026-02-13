import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ThemeService } from "../../services/theme.service";
import { ThemeToggleComponent } from "./theme-toggle.component";

describe("ThemeToggleComponent", () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should toggle theme when button clicked", () => {
    const initialTheme = themeService.theme();
    const button = fixture.nativeElement.querySelector("button");
    button.click();
    expect(themeService.theme()).not.toBe(initialTheme);
  });
});
