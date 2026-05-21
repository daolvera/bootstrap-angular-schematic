import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { ThemeService } from "../../services/theme.service";

/**
 * Theme toggle component for switching between light/dark modes
 * Displays a button with icon that changes based on current theme
 */
@Component({
  selector: "app-theme-toggle",
  standalone: true,
  imports: [],
  template: `
    <div class="theme-toggle">
      <button
        class="btn btn-link"
        (click)="toggleTheme()"
        [attr.aria-label]="
          'Switch to ' + (isDark() ? 'light' : 'dark') + ' mode'
        "
        title="Toggle theme"
      >
        @if (isDark()) {
          <i class="bi bi-sun-fill"></i>
        } @else {
          <i class="bi bi-moon-stars-fill"></i>
        }
      </button>
    </div>
  `,
  styles: [
    `
      .theme-toggle {
        display: inline-block;

        .btn-link {
          color: var(--bs-body-color);
          text-decoration: none;
          font-size: 1.25rem;
          padding: 0.25rem 0.5rem;

          &:hover {
            color: var(--bs-primary);
          }

          i {
            transition: transform 0.3s ease;
          }

          &:hover i {
            transform: rotate(20deg);
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);
  protected isDark = computed(() => this.themeService.isDarkMode());

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
