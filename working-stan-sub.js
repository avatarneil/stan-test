const NATS = require("nats");
const stan = require("node-nats-streaming");
const { StringDecoder } = require("string_decoder");

const natsClient = NATS.connect({
  url: "nats://localhost:4222",
  // userCreds: "./stan.creds",
  encoding: "binary"
});

const natss = stan.connect("stan", "hello-im-a-client", { url: "nats://localhost:4222", nc: natsClient, connectTimeout: 10000 });

const decoder = new StringDecoder("utf8");

natss.on("connect", () => {
  console.log("I'm connected!");
  const eventSubscription = natss.subscribe(`test`, {
    ...natss.subscriptionOptions(),
    manualAcks: true,
    maxInFlight: 1
  });

  eventSubscription.on("message", msg => {
    // const { data } = msg.getRawData().toString();
    console.log(decoder.write(msg.msg.array[3]));
    msg.ack();
  });
});
