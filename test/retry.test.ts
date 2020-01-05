import { retry } from '../src/retry';
import { PromiseTimeoutError } from '../src/timeout';

describe('retry', () => {

  it('should try 2 times', async () => {
    const dummyPromise = jest.fn().mockRejectedValue(new Error);

    try {
      await retry(dummyPromise, {
        retries: 2,
      });
    } catch (error) {
      expect(dummyPromise).toHaveBeenCalledTimes(2);
    }
  });

  it('should try 5 times', async () => {
    const dummyPromise = jest.fn().mockRejectedValue(new Error);

    try {
      await retry(dummyPromise, 5);
    } catch (error) {
      expect(dummyPromise).toHaveBeenCalledTimes(5);
    }
  });

  it('should throw a PromiseTimeoutError', async () => {
    const dummyPromise = jest.fn().mockRejectedValue(new PromiseTimeoutError);

    try {
      await retry(dummyPromise, 3);
    } catch (error) {
      expect(dummyPromise).toHaveBeenCalledTimes(3);
      expect(error).toBeInstanceOf(PromiseTimeoutError);
    }
  });

  describe('options', () => {

    describe('filter', () => {

      it('should not retry on PromiseTimeoutError instances', async () => {
        const dummyPromise = jest.fn().mockRejectedValue(new PromiseTimeoutError);
  
        try {
          await retry(dummyPromise, {
            retries: 3,
            filter: error => error instanceof PromiseTimeoutError,
          });
        } catch (error) {
          expect(dummyPromise).toHaveBeenCalledTimes(1);
          expect(error).toBeInstanceOf(PromiseTimeoutError);
        }
      })

    });

  });

});