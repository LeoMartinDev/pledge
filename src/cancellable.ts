export class PromiseCancellationError extends Error {
  constructor(public message: string = 'Timeout') {
    super(message);
    this.name = 'PromiseCancellation';
    this.stack = (<any> new Error()).stack;
    Object.setPrototypeOf(this, PromiseCancellationError.prototype);
  }
}

export class CancellationToken {
  promise: Promise<void>;
  private reject: any = () => {};

  constructor() {
    this.promise = new Promise((_, reject) => {
      this.reject = reject;
    });
  }

  cancel() {
    this.reject(new PromiseCancellationError);
    this.reject = undefined;
  }
}

export function getCancellationToken(): CancellationToken {
  return new CancellationToken();
}

export function cancellable<T = any>(promise: (() => Promise<T>) | Promise<T>, cancellationToken: CancellationToken): Promise<T> {
  return Promise.race([
    cancellationToken.promise as any,
    typeof promise === 'function' ? promise() : promise,
  ]);
}