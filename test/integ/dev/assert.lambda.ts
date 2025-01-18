import { Assert } from '../service.assert';

export async function handler(_: any) {
  return Assert.run('default', async () => { return; });
}

// allows running the handler locally with ts-node
if (Assert.isLocal()) {
  void handler({});
}