import { waitFor } from './waitFor';

export class PromiseTimeoutError extends Error {
  constructor(public message: string = 'Timeout') {
    super(message);
    this.name = 'PromiseTimeout';
    this.stack = (<any> new Error()).stack;
    Object.setPrototypeOf(this, PromiseTimeoutError.prototype);
  }
}

export function timeout<T = any>(promise: (() => Promise<T>) | Promise<T>, milliseconds: number): Promise<T> {
  const timeoutPromise = () => waitFor(milliseconds)
    .then(() => Promise.reject(new PromiseTimeoutError(`Promise timed out in ${milliseconds}ms!`)));

  return Promise.race([
    timeoutPromise(),
    typeof promise === 'function' ? promise() : promise,
  ]);
}
