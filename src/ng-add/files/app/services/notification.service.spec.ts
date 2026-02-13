import { NotificationService } from "../services/notification.service";

describe("NotificationService", () => {
  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should start with no notifications", (done: DoneFn) => {
    service.notifications$.subscribe((notifications) => {
      expect(notifications.length).toBe(0);
      done();
    });
  });

  it("should add success notification", (done: DoneFn) => {
    service.success("Success message");
    service.notifications$.subscribe((notifications) => {
      expect(notifications.length).toBe(1);
      expect(notifications[0].type).toBe("success");
      expect(notifications[0].message).toBe("Success message");
      done();
    });
  });

  it("should add error notification", (done: DoneFn) => {
    service.error("Error message");
    service.notifications$.subscribe((notifications) => {
      const notification = notifications[0];
      expect(notification.type).toBe("error");
      expect(notification.message).toBe("Error message");
      done();
    });
  });

  it("should dismiss notification", () => {
    service.success("Test");
    const notifications = (service as any).notificationsSubject.value;
    const notification = notifications[0];
    service.dismiss(notification);
    expect((service as any).notificationsSubject.value.length).toBe(0);
  });

  it("should clear all notifications", () => {
    service.success("Test 1");
    service.error("Test 2");
    service.clear();
    expect((service as any).notificationsSubject.value.length).toBe(0);
  });
});
