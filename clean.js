const { Project, SyntaxKind } = require("ts-morph");

const project = new Project();
project.addSourceFileAtPath("packages/tui/src/app.tsx");
const sourceFile = project.getSourceFileOrThrow("packages/tui/src/app.tsx");

const unwanted = new Set([
  'session.new',
  'workspace.copy_path',
  'agent.list',
  'agent.switch',
  'repo.checkout',
  'repo.push',
  'repo.pull',
  'repo.fetch',
  'repo.commit',
  'repo.status',
  'project.settings',
  'project.open',
  'project.new',
  'project.close',
  'window.reload',
  'window.quit',
  'window.zoom_in',
  'window.zoom_out',
  'window.zoom_reset',
  'editor.open',
  'browser.open',
  'browser.reload',
  'browser.back',
  'browser.forward',
]);

const variableDecls = sourceFile.getVariableDeclarations();
for (const v of variableDecls) {
    if (v.getName() === "appCommands") {
        const initializer = v.getInitializer();
        if (initializer && initializer.getKind() === SyntaxKind.CallExpression) {
            const args = initializer.getArguments();
            if (args.length > 0 && args[0].getKind() === SyntaxKind.ArrowFunction) {
                const body = args[0].getBody();
                if (body.getKind() === SyntaxKind.ArrayLiteralExpression) {
                    const elements = body.getElements();
                    const elementsToRemove = [];
                    for (const elem of elements) {
                        if (elem.getKind() === SyntaxKind.ObjectLiteralExpression) {
                            const nameProp = elem.getProperty("name");
                            if (nameProp && nameProp.getKind() === SyntaxKind.PropertyAssignment) {
                                const val = nameProp.getInitializer();
                                if (val && val.getKind() === SyntaxKind.StringLiteral) {
                                    const nameVal = val.getLiteralValue();
                                    if (unwanted.has(nameVal)) {
                                        elementsToRemove.push(elem);
                                    }
                                }
                            }
                        }
                    }
                    elementsToRemove.reverse().forEach(el => el.remove());
                }
            }
        }
    }
}

sourceFile.saveSync();
console.log("Successfully removed unwanted commands from app.tsx");
