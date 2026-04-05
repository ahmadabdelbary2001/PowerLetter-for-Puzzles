interface ImportMeta {
  readonly glob: (pattern: string) => Record<string, () => Promise<any>>;
  readonly env: Record<string, any>;
}
