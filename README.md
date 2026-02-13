# @dao/bootstrap-angular-schematic

An Angular schematic that generates a fully-configured Angular application with Bootstrap 5+, ng-bootstrap, pre-built services, and common UI components. Save hours of setup time with a production-ready foundation for your Angular projects.

## Quick Start

```bash
# Create a new Angular project (if needed)
ng new my-app --routing --style=scss
cd my-app

# Add the schematic
ng add @dao/bootstrap-angular-schematic

# Start development server
ng serve
```

Open <http://localhost:4200> to see your Bootstrap-enabled Angular app!

## Features

- ✅ **Angular 19+** with standalone components
- ✅ **Bootstrap 5.3+** fully integrated
- ✅ **ng-bootstrap** components
- ✅ **Responsive Layout** with header, footer, and mobile sidebar
- ✅ **Pre-built Services**: Spinner, Modal, Navigation, Notification, Theme
- ✅ **Sample Pages** with routing configured
- ✅ **SCSS Setup** with variables and global styles
- ✅ **Dark Mode** theme toggle
- ✅ **Production-ready** configuration

## Requirements

- Node.js >= 18.19.0
- npm >= 10.0.0
- Angular CLI >= 19.0.0

## What Gets Generated

```text
src/
├── app/
│   ├── components/        # UI components
│   │   ├── header/        # Responsive navigation bar
│   │   ├── footer/        # Multi-column footer
│   │   ├── sidebar/       # Mobile navigation menu
│   │   ├── layout/        # App layout wrapper
│   │   ├── spinner/       # Loading overlay
│   │   ├── notifications/ # Toast messages
│   │   └── theme-toggle/  # Dark mode toggle
│   ├── services/
│   │   ├── spinner.service.ts      # Loading state
│   │   ├── modal.service.ts        # Modal dialogs
│   │   ├── navigation.service.ts   # Sidebar control
│   │   ├── notification.service.ts # Toast notifications
│   │   └── theme.service.ts        # Theme management
│   ├── pages/
│   │   ├── home/          # Landing page
│   │   ├── about/         # About page
│   │   └── not-found/     # 404 page
│   ├── interceptors/      # HTTP interceptors
│   ├── models/            # TypeScript interfaces
│   └── utils/             # Form utilities & validators
├── styles/
│   ├── _variables.scss    # Bootstrap customization
│   ├── _global.scss       # Global styles
│   └── styles.scss        # Main stylesheet
└── environments/          # Environment configs
```

## Usage Examples

### Spinner Service

```typescript
import { SpinnerService } from './services/spinner.service';

constructor(private spinner: SpinnerService) {}

async loadData() {
  this.spinner.show('Loading...');
  try {
    await this.fetchData();
  } finally {
    this.spinner.hide();
  }
}
```

### Modal Service

```typescript
import { ModalService } from './services/modal.service';
import { SampleModalComponent } from './components/sample-modal/sample-modal.component';

constructor(private modalService: ModalService) {}

openModal() {
  const modalRef = this.modalService.open(SampleModalComponent, {
    title: 'My Modal',
    size: 'lg',
    centered: true
  });
  
  modalRef.result.then(
    (result) => console.log('Closed:', result),
    (reason) => console.log('Dismissed:', reason)
  );
}
```

### Notification Service

```typescript
import { NotificationService } from './services/notification.service';

constructor(private notification: NotificationService) {}

showSuccess() {
  this.notification.success('Operation completed!');
}

showError() {
  this.notification.error('Something went wrong');
}
```

### Theme Service

```typescript
import { ThemeService } from './services/theme.service';

constructor(private theme: ThemeService) {}

toggleTheme() {
  this.theme.toggleTheme();
}

// Get current theme
const currentTheme = this.theme.currentTheme; // 'light' or 'dark'
```

## Customization

### Bootstrap Variables

Edit `src/styles/_variables.scss`:

```scss
$primary: #0066cc;
$secondary: #6c757d;
$success: #28a745;
// ... customize colors, fonts, spacing, etc.
```

### SCSS Global Styles

Edit `src/styles/_global.scss` for custom global styles.

### Component Customization

All generated components are in your project and fully customizable. Modify HTML, SCSS, and TypeScript as needed.

## Installation Options

```bash
# Standard installation
ng add @dao/bootstrap-angular-schematic

# Skip npm install (install dependencies manually later)
ng add @dao/bootstrap-angular-schematic --skip-install

# Manual installation (if ng add doesn't work)
npm install @dao/bootstrap-angular-schematic
ng generate @dao/bootstrap-angular-schematic:ng-add
```

## Common Questions

**Can I use this with an existing project?**  
Yes, but it will overwrite some files (app.component.ts, app.config.ts, etc.). Review changes carefully or use with new projects.

**Can I remove components I don't need?**  
Yes, delete the component files and remove their imports from the layout.

**How do I customize the header/footer?**  
Edit the HTML/SCSS files in `src/app/components/header/` and `src/app/components/footer/`.

**Can I use a different Bootstrap theme?**  
Yes, modify the Bootstrap variables in `src/styles/_variables.scss` or import a custom theme.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Development

For developers working on this schematic:

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run build:watch

# Test
npm test

# Clean build
npm run clean
```

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed development documentation.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

MIT
