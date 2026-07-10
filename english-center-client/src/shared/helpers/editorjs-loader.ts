// @ts-nocheck

export const loadEditorJs = async () => {
  const dynamicImport = new Function("specifier", "return import(specifier);") as (specifier: string) => Promise<any>;
  const [{ default: EditorJS }, { default: Header }, { default: List }, { default: Marker }] = await Promise.all([
    dynamicImport("@editorjs/editorjs"),
    dynamicImport("@editorjs/header"),
    dynamicImport("@editorjs/list"),
    dynamicImport("@editorjs/marker"),
  ]);

  return { EditorJS, Header, List, Marker };
};
