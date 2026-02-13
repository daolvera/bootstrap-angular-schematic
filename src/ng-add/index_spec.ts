import { Tree } from "@angular-devkit/schematics";
import {
  SchematicTestRunner,
  UnitTestTree,
} from "@angular-devkit/schematics/testing";
import * as path from "path";

const collectionPath = path.join(__dirname, "../collection.json");

describe("ng-add schematic", () => {
  let runner: SchematicTestRunner;
  let appTree: UnitTestTree;

  beforeEach(() => {
    runner = new SchematicTestRunner("schematics", collectionPath);
    appTree = createTestApp();
  });

  it("should add Bootstrap and ng-bootstrap dependencies to package.json", async () => {
    const tree = await runner.runSchematic(
      "ng-add",
      { skipInstall: true },
      appTree,
    );
    const packageJson = JSON.parse(tree.readContent("/package.json"));

    expect(packageJson.dependencies["bootstrap"]).toBeDefined();
    expect(
      packageJson.dependencies["@ng-bootstrap/ng-bootstrap"],
    ).toBeDefined();
    expect(packageJson.dependencies["@popperjs/core"]).toBeDefined();
  });

  it("should update angular.json with Bootstrap Icons and custom styles", async () => {
    const tree = await runner.runSchematic(
      "ng-add",
      { skipInstall: true },
      appTree,
    );
    const angularJson = JSON.parse(tree.readContent("/angular.json"));
    const styles =
      angularJson.projects["test-app"].architect.build.options.styles;

    expect(styles).toContain(
      "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css",
    );
    expect(styles.some((s: string) => s.includes("styles/styles.scss"))).toBe(
      true,
    );
  });

  it("should create all service files", async () => {
    const tree = await runner.runSchematic(
      "ng-add",
      { skipInstall: true },
      appTree,
    );

    expect(tree.files).toContain("/src/app/services/spinner.service.ts");
    expect(tree.files).toContain("/src/app/services/modal.service.ts");
    expect(tree.files).toContain("/src/app/services/navigation.service.ts");
    expect(tree.files).toContain("/src/app/services/notification.service.ts");
  });

  it("should create all component files", async () => {
    const tree = await runner.runSchematic(
      "ng-add",
      { skipInstall: true },
      appTree,
    );

    expect(tree.files).toContain(
      "/src/app/components/header/header.component.ts",
    );
    expect(tree.files).toContain(
      "/src/app/components/footer/footer.component.ts",
    );
    expect(tree.files).toContain(
      "/src/app/components/sidebar/sidebar.component.ts",
    );
    expect(tree.files).toContain(
      "/src/app/components/spinner/spinner.component.ts",
    );
    expect(tree.files).toContain(
      "/src/app/components/layout/layout.component.ts",
    );
    expect(tree.files).toContain(
      "/src/app/components/notifications/notifications.component.ts",
    );
  });

  it("should create all page components", async () => {
    const tree = await runner.runSchematic(
      "ng-add",
      { skipInstall: true },
      appTree,
    );

    expect(tree.files).toContain("/src/app/pages/home/home.component.ts");
    expect(tree.files).toContain("/src/app/pages/about/about.component.ts");
    expect(tree.files).toContain(
      "/src/app/pages/not-found/not-found.component.ts",
    );
  });

  it("should create style files", async () => {
    const tree = await runner.runSchematic(
      "ng-add",
      { skipInstall: true },
      appTree,
    );

    expect(tree.files).toContain("/src/styles/_variables.scss");
    expect(tree.files).toContain("/src/styles/_global.scss");
    expect(tree.files).toContain("/src/styles/styles.scss");
  });

  it("should create app configuration files", async () => {
    const tree = await runner.runSchematic(
      "ng-add",
      { skipInstall: true },
      appTree,
    );

    expect(tree.files).toContain("/src/app/app.config.ts");
    expect(tree.files).toContain("/src/app/app.routes.ts");
    expect(tree.files).toContain("/src/app/app.component.ts");
  });

  it("should create environment files", async () => {
    const tree = await runner.runSchematic(
      "ng-add",
      { skipInstall: true },
      appTree,
    );

    expect(tree.files).toContain("/src/environments/environment.ts");
    expect(tree.files).toContain("/src/environments/environment.prod.ts");
  });

  it("should create models file", async () => {
    const tree = await runner.runSchematic(
      "ng-add",
      { skipInstall: true },
      appTree,
    );

    expect(tree.files).toContain("/src/app/models/index.ts");
  });

  it("should create interceptors", async () => {
    const tree = await runner.runSchematic(
      "ng-add",
      { skipInstall: true },
      appTree,
    );

    expect(tree.files).toContain(
      "/src/app/interceptors/spinner.interceptor.ts",
    );
  });

  it("should handle skipInstall option", async () => {
    const tree = await runner.runSchematic(
      "ng-add",
      { skipInstall: true },
      appTree,
    );

    // Should complete without installing dependencies
    expect(tree.files.length).toBeGreaterThan(0);
  });
});

/**
 * Create a basic Angular application tree for testing
 */
function createTestApp(): UnitTestTree {
  const tree = Tree.empty() as UnitTestTree;

  // Create package.json
  tree.create(
    "/package.json",
    JSON.stringify(
      {
        name: "test-app",
        version: "0.0.0",
        dependencies: {
          "@angular/core": "^19.0.0",
          "@angular/common": "^19.0.0",
          "@angular/platform-browser": "^19.0.0",
        },
      },
      null,
      2,
    ),
  );

  // Create angular.json
  tree.create(
    "/angular.json",
    JSON.stringify(
      {
        version: 1,
        projects: {
          "test-app": {
            sourceRoot: "src",
            architect: {
              build: {
                options: {
                  styles: ["src/styles.scss"],
                },
              },
            },
          },
        },
      },
      null,
      2,
    ),
  );

  // Create basic app files
  tree.create(
    "/src/app/app.config.ts",
    `
    import { ApplicationConfig } from '@angular/core';
    export const appConfig: ApplicationConfig = { providers: [] };
  `,
  );

  return tree;
}
