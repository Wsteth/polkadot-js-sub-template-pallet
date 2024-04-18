import { ApiPromise, WsProvider } from "@polkadot/api";
const WEB_SOCKET = "ws://127.0.0.1:9944";

const connect = async (): Promise<ApiPromise> => {
  const provider = new WsProvider(WEB_SOCKET); // 替换为你的节点地址
  const api = await ApiPromise.create({ provider, types: {} });
  await api.isReady;
  return api;
};

const subVal = async (api: ApiPromise) => {
  await api.query.templateModule.something((something: number) => {
    console.log(`value of something is: ${something}.`);
  });
};

const subEvent = async (api: ApiPromise) => {
  await api.query.system.events((events: any) => {
    events.forEach((record: any) => {
      const { event } = record;
      const { section, method, data } = event;

      if (section === "templateModule" && method === "SomethingStored") {
        console.log(
          `SomethingStored { who: ${data.who.toString()}, something: ${data.something.toString()}}`
        );
      }
    });
  });
};

const main = async () => {
  const api = await connect();
  await subVal(api);
  await subEvent(api);
};

main().catch((err) => {
  console.log("error is", err);
  process.exit(1);
});
