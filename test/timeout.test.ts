import { timeout, PromiseTimeoutError } from '../src/timeout';

describe('timeout', () => {

  it('should throw a PromiseTimeoutError after 2s', async () => {
    jest.useFakeTimers();
    const dummyPromise = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 500)));

      timeout(dummyPromise, 100)
        .catch(error => {
          expect(error).toBeInstanceOf(PromiseTimeoutError);
        });
      jest.runAllTimers();
  });

  it('should not timeout', async () => {
    jest.useFakeTimers();
    const dummyPromise = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 500)));

    timeout(dummyPromise, 1000)
      .then(() => {
        expect(dummyPromise).toHaveBeenCalled();
      });
    jest.runAllTimers();
  });

});