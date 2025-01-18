import { Runner } from '../atmosphere.runner';

export async function handler(_: any) {
  return Runner.assert('default', async () => { return; });
}

// allows running the handler locally with ts-node
if (Runner.isLocal()) {
  void handler({});
}