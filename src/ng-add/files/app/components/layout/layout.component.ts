import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { NotificationsComponent } from "../notifications/notifications.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { SpinnerComponent } from "../spinner/spinner.component";

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    SpinnerComponent,
    NotificationsComponent,
  ],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
