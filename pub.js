const NATS = require("nats");
const stan = require("node-nats-streaming");

const natsClient = NATS.connect({
  url: "nats://localhost:4222",
  // userCreds: "./stan.creds",
  encoding: "binary"
});

const natss = stan.connect("stan", "hello-im-a-client-pub", { nc: natsClient });

natss.on("connect", () => {
  console.log("I'm connected!");
  natss.publish("test", JSON.stringify({ foo: "Hello" }), (err, guid) => {
    console.log(err, guid);
  });
});
