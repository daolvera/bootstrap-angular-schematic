import { TestBed } from "@angular/core/testing";
import { ThemeService } from "./theme.service";

describe("ThemeService", () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should default to auto theme", () => {
    expect(service.theme()).toBe("auto");
  });

  it("should set theme", () => {
    service.setTheme("dark");
    expect(service.theme()).toBe("dark");
  });

  it("should toggle between light and dark", () => {
    service.setTheme("light");
    service.toggleTheme();
    expect(service.theme()).toBe("dark");
    service.toggleTheme();
    expect(service.theme()).toBe("light");
  });

  it("should persist theme in localStorage", () => {
    service.setTheme("dark");
    expect(localStorage.getItem("app-theme")).toBe("dark");
  });

  it("should apply dark class to document", () => {
    service.setTheme("dark");
    expect(document.documentElement.classList.contains("dark-theme")).toBe(
      true,
    );
  });

  it("should remove dark class in light mode", () => {
    service.setTheme("light");
    expect(document.documentElement.classList.contains("dark-theme")).toBe(
      false,
    );
  });
});
