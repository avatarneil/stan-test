const NATS = require("nats");
const stan = require("node-nats-streaming");

const natsClient = NATS.connect({
  url: "nats://0.0.0.0:4222",
  // userCreds: "./stan.creds",
  encoding: "binary"
});

natsClient.on('connect', () => {
  console.log('I am a connected boi')
})

const natss = stan.connect("test-cluster", "hello-im-a-client", { url: "nats://0.0.0.0:4222", nc: natsClient, connectTimeout: 10000 });

natss.on("connect", () => {
  console.log("I'm connected!");
  const eventSubscription = natss.subscribe(`test`, {
    ...natss.subscriptionOptions(),
    manualAcks: true,
    maxInFlight: 1
  });

  eventSubscription.on("message", msg => {
    console.log(msg.getRawData().toString());
    msg.ack();
  });
});
