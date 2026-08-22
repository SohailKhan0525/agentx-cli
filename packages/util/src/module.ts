export namespace Module {
  export async function load(specifier: string) {
    return import(specifier)
  }
}
