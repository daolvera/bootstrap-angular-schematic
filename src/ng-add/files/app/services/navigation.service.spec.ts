import { NavigationService } from "../services/navigation.service";

describe("NavigationService", () => {
  let service: NavigationService;

  beforeEach(() => {
    service = new NavigationService();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should start with sidebar closed", (done: DoneFn) => {
    service.sidebarOpen$.subscribe((isOpen) => {
      expect(isOpen).toBe(false);
      done();
    });
  });

  it("should toggle sidebar", (done: DoneFn) => {
    service.openSidebar();
    service.sidebarOpen$.subscribe((isOpen) => {
      expect(isOpen).toBe(true);
      done();
    });
  });

  it("should close sidebar", () => {
    service.openSidebar();
    service.closeSidebar();
    expect(service.isSidebarOpen).toBe(false);
  });

  it("should toggle sidebar", () => {
    const initialState = service.isSidebarOpen;
    service.toggleSidebar();
    expect(service.isSidebarOpen).toBe(!initialState);
  });
});
