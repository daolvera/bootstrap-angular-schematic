import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { INavigationItem } from "../../models";
import { NavigationService } from "../../services/navigation.service";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  navigationItems: INavigationItem[] = [
    { label: "Home", route: "/", icon: "house" },
    { label: "About", route: "/about", icon: "info-circle" },
    { label: "Utils Demo", route: "/utils-demo", icon: "tools" },
  ];

  private navigationService = inject(NavigationService);
  protected sidebarOpen = toSignal(this.navigationService.sidebarOpen$, {
    initialValue: false,
  });

  closeSidebar(): void {
    this.navigationService.closeSidebar();
  }
}
