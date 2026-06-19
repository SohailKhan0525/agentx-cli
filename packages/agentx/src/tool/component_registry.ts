import path from "path"
import fs from "fs"
import { Effect, Schema } from "effect"
import * as Tool from "./tool"
import DESCRIPTION from "./component_registry.txt"

export const Parameters = Schema.Struct({
  action: Schema.String.annotate({ description: "Action to perform: 'search' or 'get_code'" }),
  query: Schema.optional(Schema.String).annotate({ description: "Search query for components (e.g. 'landing page', 'button')" }),
  componentName: Schema.optional(Schema.String).annotate({ description: "Exact name of the component to retrieve its code" })
})

function getInstallDir() {
    let current = __dirname;
    while (current !== path.parse(current).root) {
        if (fs.existsSync(path.join(current, "components.txt"))) {
            return current;
        }
        current = path.dirname(current);
    }
    return process.cwd();
}

function parseComponents(content: string) {
    const components: any[] = [];
    const parts = content.split(/(?=^NAME: |\nNAME: )/);
    
    for (const part of parts) {
        let text = part.trim();
        if (!text) continue;
        if (text.startsWith("NAME:")) {
            text = text.substring(5).trimStart();
        } else {
            continue;
        }
        
        const codeIndex = text.indexOf("CODE:");
        if (codeIndex === -1) continue;
        
        const name = text.substring(0, codeIndex).trim();
        const code = text.substring(codeIndex + 5).trim();
        
        // Detect dependencies
        const deps = new Set<string>();
        const importRegex = /from\s+['"]([^.'"][^'"]*)['"]/g;
        let match;
        while ((match = importRegex.exec(code)) !== null) {
            if (!match[1].startsWith('.')) {
                const pkgParts = match[1].split('/');
                if (pkgParts[0].startsWith('@')) {
                    if (pkgParts.length > 1) {
                        deps.add(`${pkgParts[0]}/${pkgParts[1]}`);
                    } else {
                        deps.add(pkgParts[0]);
                    }
                } else {
                    deps.add(pkgParts[0]);
                }
            }
        }
        
        // Detect framework
        let framework = "React";
        if (deps.has("vue")) framework = "Vue";
        else if (deps.has("svelte")) framework = "Svelte";
        else if (deps.has("solid-js")) framework = "Solid";
        else if (deps.has("next")) framework = "Next.js";
        
        // Classify category (simple heuristic based on code and name)
        let category = "UI Component";
        const lowerName = name.toLowerCase();
        const lowerCode = code.toLowerCase();
        if (lowerName.includes("nav") || lowerName.includes("header") || lowerCode.includes("<nav")) category = "Navigation";
        else if (lowerName.includes("footer") || lowerCode.includes("<footer")) category = "Footer";
        else if (lowerName.includes("hero") || lowerName.includes("landing")) category = "Hero/Landing";
        else if (lowerName.includes("card")) category = "Card";
        else if (lowerName.includes("form") || lowerName.includes("input")) category = "Form";
        else if (lowerName.includes("button")) category = "Button";
        else if (lowerName.includes("layout")) category = "Layout";
        else if (lowerCode.includes("dashboard")) category = "Dashboard";
        else if (lowerName.includes("modal") || lowerName.includes("dialog")) category = "Overlay";
        else if (lowerName.includes("table") || lowerName.includes("grid")) category = "Data Display";
        
        components.push({
            name,
            code,
            dependencies: Array.from(deps),
            framework,
            category
        });
    }
    return components;
}

let cachedComponents: any[] | null = null;

function loadAllComponents() {
    if (cachedComponents) return cachedComponents;
    
    const installDir = getInstallDir();
    const file1 = path.join(installDir, "components.txt");
    const file2 = path.join(installDir, "components2.txt");
    
    let content1 = "";
    let content2 = "";
    try { content1 = fs.readFileSync(file1, "utf-8"); } catch (e) {}
    try { content2 = fs.readFileSync(file2, "utf-8"); } catch (e) {}
    
    const comps1 = parseComponents(content1);
    const comps2 = parseComponents(content2);
    
    // Merge without duplicates
    const all = [...comps1, ...comps2];
    const unique = new Map();
    for (const c of all) {
        if (!unique.has(c.name)) unique.set(c.name, c);
    }
    
    cachedComponents = Array.from(unique.values());
    return cachedComponents;
}

export const ComponentRegistryTool = Tool.define(
  "component_registry",
  Effect.gen(function* () {
    return {
      description: DESCRIPTION,
      parameters: Parameters,
      execute: (params: { action: string; query?: string; componentName?: string }, ctx: Tool.Context) => Effect.gen(function* () {
        const components = loadAllComponents();
        
        if (params.action === "search") {
            const query = (params.query || "").toLowerCase();
            const results = components.filter(c => 
                c.name.toLowerCase().includes(query) || 
                c.category.toLowerCase().includes(query)
            ).map(c => ({
                name: c.name,
                category: c.category,
                framework: c.framework,
                dependencies: c.dependencies
            }));
            
            return {
                title: `Component Search: ${query}`,
                metadata: {},
                output: JSON.stringify(results, null, 2)
            };
        } else if (params.action === "get_code") {
            const name = params.componentName;
            if (!name) throw new Error("componentName is required for get_code");
            
            const comp = components.find(c => c.name === name);
            if (!comp) throw new Error(`Component not found: ${name}`);
            
            return {
                title: `Component Code: ${name}`,
                metadata: {},
                output: JSON.stringify({
                    name: comp.name,
                    category: comp.category,
                    framework: comp.framework,
                    dependencies: comp.dependencies,
                    code: comp.code
                }, null, 2)
            };
        }
        
        throw new Error("Invalid action");
      }).pipe(Effect.orDie)
    }
  })
)
