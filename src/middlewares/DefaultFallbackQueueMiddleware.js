import { DEFAULT_OUTBOUND_TASK_QUEUE } from '../helpers/TaskQueueHelper';

const DefaultFallbackQueueMiddleware = (next) => async (payload) => {
  console.log('DefaultFallbackQueueMiddleware called with payload => ', payload);

  if (payload === false) {
    return next(false);
  } 

  if (!'queueSid' in payload) {
    return await next({ ...payload, queueSid: DEFAULT_OUTBOUND_TASK_QUEUE });
  }

  return await next(payload);
};

export default DefaultFallbackQueueMiddleware;
