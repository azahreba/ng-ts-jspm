System.config({
  defaultJSExtensions: true,
  transpiler: "typescript",
  typescriptOptions: {
    "noImplicitAny": true,
    "typeCheck": true
  },
  paths: {
    "npm:*": "jspm_packages/npm/*",
    "github:*": "jspm_packages/github/*"
  },

  packages: {
    "app": {
      "main": "index",
      "defaultExtension": "ts",
      "meta": {
        "*.ts": {
          "loader": "ts"
        }
      }
    },
    "src": {
      "main": "index",
      "defaultExtension": "ts",
      "meta": {
        "*.ts": {
          "loader": "ts"
        }
      }
    }
  },

  map: {
    "angular": "github:angular/bower-angular@1.4.7",
    "angular-mocks": "github:angular/bower-angular-mocks@1.4.7",
    "jquery": "github:components/jquery@2.1.4",
    "less": "github:aaike/jspm-less-plugin@0.0.5",
    "ts": "github:frankwallis/plugin-typescript@2.0.17",
    "typescript": "npm:typescript@1.6.2",
    "github:aaike/jspm-less-plugin@0.0.5": {
      "less.js": "github:distros/less@2.4.0"
    },
    "github:angular/bower-angular-mocks@1.4.7": {
      "angular": "github:angular/bower-angular@1.4.7"
    },
    "github:frankwallis/plugin-typescript@2.0.17": {
      "typescript": "npm:typescript@1.6.2"
    }
  }
});
