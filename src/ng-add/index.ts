import { normalize, strings } from "@angular-devkit/core";
import {
  MergeStrategy,
  Rule,
  SchematicContext,
  Tree,
  apply,
  chain,
  mergeWith,
  move,
  template,
  url,
} from "@angular-devkit/schematics";
import { NodePackageInstallTask } from "@angular-devkit/schematics/tasks";
import { Schema } from "./schema";

/**
 * Main entry point for the ng-add schematic
 */
export function ngAdd(options: Schema): Rule {
  return chain([
    logWelcome(),
    addDependencies(options),
    removeZoneJs(options),
    updateAngularJson(options),
    updateMainStylesheet(options),
    addTemplateFiles(options),
    validateAppConfig(options),
    installDependencies(options),
    logCompletion(),
  ]);
}

/**
 * Log welcome message
 */
function logWelcome(): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    context.logger.info("");
    context.logger.info(
      "🚀 Adding Bootstrap Angular Schematic to your project...",
    );
    context.logger.info("");
    return _tree;
  };
}

/**
 * Add Bootstrap and ng-bootstrap dependencies to package.json
 */
function addDependencies(_options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const packageJsonPath = "/package.json";

    if (!tree.exists(packageJsonPath)) {
      context.logger.error("❌ Could not find package.json");
      return tree;
    }

    const packageJson = JSON.parse(
      tree.read(packageJsonPath)!.toString("utf-8"),
    );

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    // Detect Angular version from dependencies or devDependencies
    const angularVersion =
      dependencies["@angular/core"] || devDependencies["@angular/core"];
    let ngBootstrapVersion = "^20.0.0";

    // Determine appropriate ng-bootstrap version based on Angular version
    if (angularVersion) {
      const majorVersion = parseInt(angularVersion.match(/\d+/)?.[0] || "21");
      if (majorVersion >= 21) {
        ngBootstrapVersion = "^20.0.0"; // ng-bootstrap 20 for Angular 21+
      } else if (majorVersion >= 19) {
        ngBootstrapVersion = "^18.0.0"; // ng-bootstrap 18 for Angular 19-20
      } else if (majorVersion >= 17) {
        ngBootstrapVersion = "^17.0.0"; // ng-bootstrap 17 for Angular 17-18
      }
    }

    if (!angularVersion) {
      context.logger.warn(
        "⚠️  Could not detect @angular/core version. Using defaults for Angular 21+.",
      );
    }

    // Add dependencies
    dependencies["bootstrap"] = "^5.3.8";
    dependencies["@ng-bootstrap/ng-bootstrap"] = ngBootstrapVersion;
    dependencies["@popperjs/core"] = "^2.11.8";

    // Add @angular/animations if not present (required for ng-bootstrap)
    if (!dependencies["@angular/animations"]) {
      dependencies["@angular/animations"] = angularVersion || "^21.0.0";
      context.logger.info(
        "✅ Added @angular/animations (required for ng-bootstrap)",
      );
    }

    // Add @angular/forms if not present (peer dependency of ng-bootstrap)
    if (!dependencies["@angular/forms"]) {
      dependencies["@angular/forms"] = angularVersion || "^21.0.0";
      context.logger.info(
        "✅ Added @angular/forms (required for ng-bootstrap)",
      );
    }

    // Add @angular/localize if not present (peer dependency of ng-bootstrap)
    if (!dependencies["@angular/localize"]) {
      dependencies["@angular/localize"] = angularVersion || "^21.0.0";
      context.logger.info(
        "✅ Added @angular/localize (required for ng-bootstrap)",
      );
    }

    packageJson.dependencies = dependencies;

    tree.overwrite(packageJsonPath, JSON.stringify(packageJson, null, 2));

    context.logger.info(
      `✅ Added Bootstrap ${dependencies["bootstrap"]} and ng-bootstrap ${ngBootstrapVersion}`,
    );

    return tree;
  };
}

/**
 * Remove zone.js from dependencies for zoneless Angular
 */
function removeZoneJs(_options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const packageJsonPath = "/package.json";

    if (!tree.exists(packageJsonPath)) {
      return tree;
    }

    const packageJson = JSON.parse(
      tree.read(packageJsonPath)!.toString("utf-8"),
    );

    // Remove zone.js from dependencies
    if (packageJson.dependencies && packageJson.dependencies["zone.js"]) {
      delete packageJson.dependencies["zone.js"];
      context.logger.info("✅ Removed zone.js for zoneless Angular");
    }

    tree.overwrite(packageJsonPath, JSON.stringify(packageJson, null, 2));

    return tree;
  };
}

/**
 * Update angular.json configuration
 */
function updateAngularJson(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspaceConfigPath = "/angular.json";

    if (!tree.exists(workspaceConfigPath)) {
      context.logger.error("❌ Could not find angular.json");
      return tree;
    }

    const workspaceConfig = JSON.parse(
      tree.read(workspaceConfigPath)!.toString("utf-8"),
    );
    const projectName =
      options.project || Object.keys(workspaceConfig.projects)[0];
    const project = workspaceConfig.projects[projectName];

    if (!project) {
      context.logger.error(`❌ Project ${projectName} not found`);
      return tree;
    }

    if (!project.architect || !project.architect.build) {
      context.logger.warn(
        "⚠️  Could not find build configuration in angular.json",
      );
      return tree;
    }

    const styles = project.architect.build.options.styles || [];

    // Add Bootstrap Icons CSS
    const bootstrapIconsStyle =
      "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css";
    if (!styles.includes(bootstrapIconsStyle)) {
      styles.push(bootstrapIconsStyle);
      context.logger.info("✅ Added Bootstrap Icons to angular.json");
    }

    // Add custom styles folder reference
    const sourceRoot = project.sourceRoot || "src";
    const customStylesPath = `${sourceRoot}/styles/styles.scss`;
    if (
      !styles.some(
        (s: string) =>
          typeof s === "string" && s.includes("styles/styles.scss"),
      )
    ) {
      styles.push(customStylesPath);
      context.logger.info("✅ Added custom styles to angular.json");
    }

    project.architect.build.options.styles = styles;

    tree.overwrite("/angular.json", JSON.stringify(workspaceConfig, null, 2));
    context.logger.info("✅ Updated angular.json configuration");

    return tree;
  };
}

/**
 * Update the main stylesheet to import Bootstrap
 */
function updateMainStylesheet(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspaceConfigPath = "/angular.json";

    if (!tree.exists(workspaceConfigPath)) {
      context.logger.error("❌ Could not find angular.json");
      return tree;
    }

    const workspaceConfig = JSON.parse(
      tree.read(workspaceConfigPath)!.toString("utf-8"),
    );
    const projectName =
      options.project || Object.keys(workspaceConfig.projects)[0];
    const project = workspaceConfig.projects[projectName];

    if (!project) {
      context.logger.error(`❌ Project ${projectName} not found`);
      return tree;
    }

    const sourceRoot = project.sourceRoot || "src";
    const styles = project.architect.build.options.styles || [];

    // Find the main stylesheet
    let mainStylesheet: string | null = null;
    let stylesheetType = "scss";

    for (const style of styles) {
      if (typeof style === "string") {
        if (
          style.endsWith("styles.scss") ||
          style.endsWith("styles.sass") ||
          style.endsWith("styles.css") ||
          style.endsWith("styles.less")
        ) {
          mainStylesheet = style;
          if (style.endsWith(".sass")) stylesheetType = "sass";
          else if (style.endsWith(".css")) stylesheetType = "css";
          else if (style.endsWith(".less")) stylesheetType = "less";
          break;
        }
      }
    }

    // Default to src/styles.scss if not found
    if (!mainStylesheet) {
      mainStylesheet = `${sourceRoot}/styles.scss`;
    }

    const mainStylesheetPath = `/${mainStylesheet}`;

    if (!tree.exists(mainStylesheetPath)) {
      context.logger.warn(
        `⚠️  Main stylesheet ${mainStylesheet} not found, creating it...`,
      );
      tree.create(mainStylesheetPath, "");
    }

    let content = tree.read(mainStylesheetPath)!.toString("utf-8");

    // Check if our schematic imports are already present
    const hasSchematicImports = content.includes("Bootstrap Angular Schematic");

    if (hasSchematicImports) {
      context.logger.info(
        "✅ Bootstrap Angular Schematic styles already configured",
      );
      return tree;
    }

    // Prepare the imports based on stylesheet type
    let bootstrapImports = "";

    if (stylesheetType === "scss" || stylesheetType === "sass") {
      const importChar = stylesheetType === "scss" ? ";" : "";
      bootstrapImports = `// Bootstrap Angular Schematic - Auto-generated imports
// Import custom Bootstrap variables (customize colors, spacing, etc.)
@import 'styles/variables'${importChar}

// Import Bootstrap core
@import 'bootstrap/scss/bootstrap'${importChar}

// Import global styles (includes dark mode support)
@import 'styles/global'${importChar}

// Your custom styles below
`;
    } else if (stylesheetType === "css") {
      // For CSS, we'll just add a comment since we can't use Sass imports
      bootstrapImports = `/* Bootstrap Angular Schematic */
/* Note: For full Bootstrap customization, consider using SCSS instead of CSS */
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css');

/* Your custom styles below */
`;
      context.logger.warn(
        "⚠️  Using CSS stylesheet. For full customization, consider using SCSS.",
      );
    } else if (stylesheetType === "less") {
      bootstrapImports = `// Bootstrap Angular Schematic
// Note: Bootstrap uses SCSS. For full support, consider using SCSS instead of LESS
@import (css) 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css';

// Your custom styles below
`;
      context.logger.warn(
        "⚠️  Using LESS stylesheet. Bootstrap uses SCSS - consider migrating to SCSS for full customization.",
      );
    }

    // Prepend the imports to existing content
    const updatedContent = bootstrapImports + content;

    tree.overwrite(mainStylesheetPath, updatedContent);
    context.logger.info(`✅ Updated ${mainStylesheet} with Bootstrap imports`);

    return tree;
  };
}

/**
 * Copy and process template files to the project
 */
function addTemplateFiles(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspaceConfigPath = "/angular.json";

    if (!tree.exists(workspaceConfigPath)) {
      context.logger.error("❌ Could not find angular.json");
      return tree;
    }

    const workspaceConfig = JSON.parse(
      tree.read(workspaceConfigPath)!.toString("utf-8"),
    );
    const projectName =
      options.project || Object.keys(workspaceConfig.projects)[0];
    const project = workspaceConfig.projects[projectName];

    if (!project) {
      context.logger.error(`❌ Project ${projectName} not found`);
      return tree;
    }

    const sourceRoot = project.sourceRoot || "src";

    // Apply template files
    const templateSource = apply(url("./files"), [
      template({
        ...strings,
        ...options,
      }),
      move(normalize(sourceRoot)),
    ]);

    context.logger.info(
      "✅ Added template files (services, components, pages, styles)",
    );

    return mergeWith(templateSource, MergeStrategy.Overwrite);
  };
}

/**
 * Validate app.config.ts compatibility for ng-bootstrap template output
 */
function validateAppConfig(_options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const appConfigPath = "/src/app/app.config.ts";

    if (!tree.exists(appConfigPath)) {
      context.logger.warn(
        "⚠️  Could not find app.config.ts - skipping ng-bootstrap provider setup",
      );
      return tree;
    }

    let content = tree.read(appConfigPath)!.toString("utf-8");

    // Check if already has provideZonelessChangeDetection
    if (content.includes("provideZonelessChangeDetection")) {
      context.logger.info(
        "✅ app.config.ts already includes zoneless change detection",
      );
    } else {
      context.logger.warn(
        "⚠️  app.config.ts does not include provideZonelessChangeDetection - template will overwrite it",
      );
    }

    context.logger.info("✅ Validated app.config.ts for ng-bootstrap template");

    return tree;
  };
}

/**
 * Install npm dependencies
 */
function installDependencies(options: Schema): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    if (!options.skipInstall) {
      context.addTask(new NodePackageInstallTask());
      context.logger.info("📦 Installing dependencies...");
    } else {
      context.logger.info(
        "⏭️  Skipping dependency installation (--skip-install flag)",
      );
    }

    return _tree;
  };
}

/**
 * Log completion message
 */
function logCompletion(): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    context.logger.info("");
    context.logger.info(
      "✨ Bootstrap Angular Schematic installation complete!",
    );
    context.logger.info("");
    context.logger.info("🎯 Features:");
    context.logger.info("  • Zoneless Angular - no Zone.js!");
    context.logger.info("  • Bootstrap 5 with full SCSS customization");
    context.logger.info("  • ng-bootstrap components");
    context.logger.info("  • OnPush change detection strategy");
    context.logger.info("  • Signal-based state management");
    context.logger.info("  • Modern Angular control flow (@if, @for)");
    context.logger.info("");
    context.logger.info("📚 Next steps:");
    context.logger.info('  1. Run "ng serve" to start the development server');
    context.logger.info("  2. Open http://localhost:4200 in your browser");
    context.logger.info("  3. Explore the demo components on the home page");
    context.logger.info("");
    context.logger.info("📖 Generated structure:");
    context.logger.info(
      "  • Services: Spinner, Modal, Navigation, Notification",
    );
    context.logger.info("  • Components: Header, Footer, Sidebar, Layout");
    context.logger.info("  • Pages: Home, About, Not Found");
    context.logger.info("  • Styles: Bootstrap 5 with custom SCSS");
    context.logger.info("     All components use OnPush change detection.");
    context.logger.info("");
    return _tree;
  };
}
