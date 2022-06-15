const TokenValidator = require('twilio-flex-token-validator').functionValidator;

exports.handler = TokenValidator((context, event, callback) => {
  const client = context.getTwilioClient();

  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  console.log('[worker-queues] Fetching queues for worker => ', event.workerSid);

  client.taskrouter
    .workspaces(context.FLEX_TASKROUTER_WORKSPACE_SID)
    .taskQueues
    .list({ workerSid: event.workerSid, limit: 20 })
    .then(taskQueues => {
      response.appendHeader('Content-Type', 'application/json');
      response.setStatusCode(200);
      response.setBody({
        taskQueues: taskQueues.map(q => ({ sid: q.sid, friendlyName: q.friendlyName })),
        workerSid: event.workerSid,
      });

      return callback(null, response);
    })
    .catch(err => {
      console.error(
        `[worker-queues] An error occurred at trying to fetch task queues for worker ${event.workerSid}`,
        err
      );

      return callback(500, { error: 'An internal error occurred' });
    });
});
