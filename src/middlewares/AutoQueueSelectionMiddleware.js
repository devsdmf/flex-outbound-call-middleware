import { Manager } from '@twilio/flex-ui';

import { taskQueueCanHandleOutboundCalls } from '../helpers/TaskQueueHelper';

const SERVERLESS_DOMAIN = `${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}`;

const getWorkerSid = () => Manager.getInstance()
  .store
  .getState()
  .flex
  .worker
  .worker
  .sid;


const AutoQueueSelectionMiddleware = (next) => async (payload) => {
  console.log('AutoQueueSelectionMiddleware called with payload => ', payload);

  if (payload === false) 
    return next(false);

  const options = {
    method: 'POST',
    body: new URLSearchParams({ workerSid: getWorkerSid() }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  };

  return fetch(`${SERVERLESS_DOMAIN}/worker-queues`, options)
    .then(res => res.json())
    .then(async data => {
      console.log('[AutoQueueSelectionMiddleware] Server returned: ', data);
      const allowedTaskQueues = data.taskQueues.filter(q => taskQueueCanHandleOutboundCalls(q.sid));

      if (allowedTaskQueues.length === 0) {
        console.log(
          '[AutoQueueSelectionMiddleware] No suitable queue found, ' +
          'moving to the next middleware without a queue'
        );

        return await next(payload);
      }

      const queueSid = allowedTaskQueues.shift().sid;
      return await next({ ...payload, queueSid });
    })
    .catch(err => {
      console.error('[AutoQueueSelectionMiddleware] An error occurred: ', err);
      return false;
    });
};

export default AutoQueueSelectionMiddleware;
