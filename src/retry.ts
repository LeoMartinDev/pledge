type RetryOptionsFilter = (error: Error) => boolean | Promise<boolean>;

interface RetryOptions {
  retries: number
  filter?: RetryOptionsFilter
}

export async function retry<T = any>(promise: (() => Promise<T>) | Promise<T>, optionsOrRetry: number | RetryOptions): Promise<T> {
  let defaultOptions: RetryOptions = {
    retries: 1,
  };

  if (typeof optionsOrRetry === 'number') {
    defaultOptions.retries = optionsOrRetry;
  } else {
    Object.assign(defaultOptions, optionsOrRetry);
  }
  let lastError;

  while (defaultOptions.retries > 0) {
    try {
      return await (typeof promise === 'function' ? promise() : promise);
    } catch (error) {
      if (defaultOptions.filter) {
        const shouldThrow = await Promise.resolve(defaultOptions.filter(error)).catch();

        if (shouldThrow) throw error;
      }
      lastError = error;
    }
    defaultOptions.retries = defaultOptions.retries - 1;
  }
  throw lastError;
}
