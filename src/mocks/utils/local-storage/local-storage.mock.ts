/**
 * Local storage mock for unit tests.
 */
export class LocalStorageMock {
  public getItem(key: string): unknown {
    return Boolean(this[key]) ? this[key] : null;
  }

  public setItem(key: string, value: string | boolean | number): void {
    this[key] = value;
  }

  public removeItem(key: string): void {
    this[key] = void 0;
  }
}
