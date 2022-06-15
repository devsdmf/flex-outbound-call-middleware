import { Manager } from '@twilio/flex-ui';

import { namespace } from '../states';

import { taskQueueCanHandleOutboundCalls } from '../helpers/TaskQueueHelper';

const getTaskQueues = () => Manager.getInstance()
  .store.getState()[namespace]
  .WorkerTaskQueues.taskQueues;

const AutoQueueSelectionMiddleware = (next) => async (payload) => {
  console.log('AutoQueueSelectionMiddleware called with payload => ', payload);

  if (payload === false) 
    return next(false);

  const allowedTaskQueues = getTaskQueues().filter(q => taskQueueCanHandleOutboundCalls(q.sid));

  if (allowedTaskQueues.length === 0) {
    console.log(
      '[AutoQueueSelectionMiddleware] No suitable queue found, ' + 
      'moving to the next middleware'
    );

    return await next(payload);
  }

  const queueSid = allowedTaskQueues.shift().sid;
  return await next({ ...payload, queueSid });
};

export default AutoQueueSelectionMiddleware;
