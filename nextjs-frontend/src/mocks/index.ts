async function initMocks() {
  if (typeof window === 'undefined') {
    return;
  }

  if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
    const { worker } = await import('./browser');
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
}

export default initMocks;

