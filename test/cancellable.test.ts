import { getCancellationToken, cancellable, PromiseCancellationError, CancellationToken } from '../src/cancellable';

describe('cancellable', () => {

  it('should cancel promise', async () => {
    const dummyPromise = jest.fn().mockResolvedValue(true);
    const dummyPromiseCancelToken = getCancellationToken();
    const cancellablePromise = cancellable(dummyPromise, dummyPromiseCancelToken);
    
    dummyPromiseCancelToken.cancel();
    try {
      await cancellablePromise;
    } catch (error) {
      expect(error).toBeInstanceOf(PromiseCancellationError);
    }
  });

});

describe('getCancellationToken', () => {

  it('should return a cancellation token', () => {
    const cancellationToken = getCancellationToken();

    expect(cancellationToken).toBeInstanceOf(CancellationToken);
  });

});