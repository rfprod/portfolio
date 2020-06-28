export interface IActionPayload<T = void> {
  payload: T;
}

/**
 * Action creator.
 * @param actionScope
 */
export const getActionCreator = (actionScope: string) => <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends IActionPayload<any> = { payload: void }
>(
  actionName: string,
) =>
  class {
    public static readonly type: string = `[${actionScope}]: ${actionName}`;

    /**
     * Constructor.
     * @param payload
     */
    constructor(public payload: T['payload']) {}
  };

export type TEmptyPayload = IActionPayload<null>;
