declare namespace NodeJS {
  interface Global {
    appRoot: string;
  }
}

declare var global: NodeJS.Global & typeof globalThis;