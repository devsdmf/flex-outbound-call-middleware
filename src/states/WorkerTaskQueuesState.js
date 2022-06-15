import { Manager } from '@twilio/flex-ui';

const SERVERLESS_DOMAIN = `${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}`;

const ACTION_INIT_TASK_QUEUES = 'UPDATE_TASK_QUEUES';

const fetchTaskQueues = async () => {
  const workerSid = Manager.getInstance().store.getState().flex.worker.worker.sid;
  const token = Manager.getInstance().store.getState().flex.session.ssoTokenPayload.token;

  console.log(`[WorkerTaskQueuesState] Fetching task queues for worker ${workerSid}`);

  const options = {
    method: 'POST',
    body: new URLSearchParams({ workerSid, Token: token }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  };

  return fetch(`${SERVERLESS_DOMAIN}/worker-queues`, options)
    .then(res => res.json())
    .then(async data => data.taskQueues)
    .catch(err => {
      console.error('[AutoQueueSelectionMiddleware] An error occurred: ', err);
      return false;
    });
}

const initialState = {
  taskQueues: [],
};

export const Actions = {
  initTaskQueues: () => ({
    type: ACTION_INIT_TASK_QUEUES,
    payload: fetchTaskQueues(),
  })
};

export const reduce = (state = initialState, action) => {
  switch (action.type) {
    case `${ACTION_INIT_TASK_QUEUES}_PENDING`:
      return state;
      break;
    case `${ACTION_INIT_TASK_QUEUES}_FULFILLED`:
      return { ...state, taskQueues: action.payload };
      break;
    case `${ACTION_INIT_TASK_QUEUES}_REJECTED`:
      return {
        ...state,
        error: action.payload.error
      };
      break;
    default:
      return state;
  };
};
