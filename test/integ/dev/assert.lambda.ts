import { Session } from '../service.session';

export async function handler(_: any) {
  return Session.assert(async () => { return; });
}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}