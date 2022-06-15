import { combineReducers } from 'redux';

import { reduce as WorkerTaskQueuesReducer } from './WorkerTaskQueuesState';

// Register your redux store under a unique namespace
export const namespace = 'flex-outbound-call-interceptor';

// Combine the reducers
export default combineReducers({
  WorkerTaskQueues: WorkerTaskQueuesReducer,
});
