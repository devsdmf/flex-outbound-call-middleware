import AutoQueueSelectionMiddleware from './AutoQueueSelectionMiddleware';
import DefaultFallbackQueueMiddleware from './DefaultFallbackQueueMiddleware';
import QueueDebuggerMiddleware from './QueueDebuggerMiddleware';
import ReifyPayloadMiddleware from './ReifyPayloadMiddleware';

// register the middlewares in the execution order on this following array
export const middlewares = [
  AutoQueueSelectionMiddleware,
  DefaultFallbackQueueMiddleware,
  QueueDebuggerMiddleware,
  ReifyPayloadMiddleware,
];

const EVENT_NAME = 'beforeStartOutboundCall';


const fulfill = _ =>  _ => _;

const registerMiddlewares = (flex, middlewares) => {
  console.log(`[outbound-call-interceptor] Registering middlewares for event ${EVENT_NAME}`);

  //middlewares.map(m => flex.Actions.addListener(EVENT_NAME, m));
  
  flex.Actions.replaceAction('StartOutboundCall', (payload, original) => {
    console.log('Called StartOutboundCall action with payload => ', payload);

    const wrappedOriginal = next => async payload => {
      console.log('Payload ====> ', payload);
      
      if (payload === false) {
        console.log('StartOutboundCall action canceled by middleware execution');
        return false;
      }

      return original(payload);
    }

    const chain = middlewares.concat([wrappedOriginal]).reverse();
    const runner = chain.reduce((actual, handler) => handler(actual), payload);
    runner(payload).then(r => console.log('r =====> ', r));
  });
};

export default registerMiddlewares;
