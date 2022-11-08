type PayloadType<T> = {
  result: T;
  message: string;
};

export class BaseResultType<T> {
  constructor(partial: Partial<BaseResultType<T>>) {
    Object.assign(this, partial);
  }

  static successResult<T>(payload: PayloadType<T>): BaseResultType<T> {
    const { result, message } = payload;

    return new BaseResultType({
      result,
      message,
      success: true,
    });
  }

  static errorResult<T>(payload: PayloadType<T>): BaseResultType<T> {
    const { result, message } = payload;

    return new BaseResultType({
      result,
      message,
      success: false,
    });
  }
}