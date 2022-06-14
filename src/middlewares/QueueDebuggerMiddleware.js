const QueueDebuggerMiddleware = (next) => async (payload) => {
  console.log('QueueDebuggerMiddleware called with payload => ', payload);

  return await next(payload);
};

export default QueueDebuggerMiddleware;
