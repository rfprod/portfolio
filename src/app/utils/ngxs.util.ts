export interface IActionPayload<T = void> {
  payload: T;
}

/**
 * Action creator.
 * @param actionScope
 */
export const getActionCreator = (actionScope: string) => <
  T extends IActionPayload<void | unknown> = { payload: void }
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
