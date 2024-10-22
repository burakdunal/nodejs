declare module 'config' {
  function get<T>(key: string): T;
  export = { get };
}