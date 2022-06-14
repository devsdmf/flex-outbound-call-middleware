const ReifyPayloadMiddleware = (next) => async (payload) => {
  console.log('ReifyPayloadMiddleware called with payload => ', payload);

  return await next(payload);
};

export default ReifyPayloadMiddleware;
