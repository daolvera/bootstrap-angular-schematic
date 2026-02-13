import { SpinnerService } from "../services/spinner.service";

describe("SpinnerService", () => {
  let service: SpinnerService;

  beforeEach(() => {
    service = new SpinnerService();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should start with loading false", (done: DoneFn) => {
    service.isLoading$.subscribe((isLoading) => {
      expect(isLoading).toBe(false);
      done();
    });
  });

  it("should show spinner", (done: DoneFn) => {
    service.show("Loading...");
    service.isLoading$.subscribe((isLoading) => {
      expect(isLoading).toBe(true);
      done();
    });
  });

  it("should hide spinner", () => {
    service.show();
    service.hide();
    expect(service.isLoading).toBe(false);
  });

  it("should toggle spinner", () => {
    const initialState = service.isLoading;
    service.toggle();
    expect(service.isLoading).toBe(!initialState);
  });

  it("should set loading message", (done: DoneFn) => {
    const testMessage = "Processing...";
    service.show(testMessage);
    service.message$.subscribe((message) => {
      expect(message).toBe(testMessage);
      done();
    });
  });
});
