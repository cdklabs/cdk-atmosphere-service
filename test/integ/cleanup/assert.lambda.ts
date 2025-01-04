import { Session } from '../service.session';

export async function handler(_: any) {

  return Session.assert(async (session: Session) => {
    const allocateResponse = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(allocateResponse.body!);

    const account = body.environment.account;
    const region = body.environment.region;

    await session.deallocate(body.id, { outcome: 'success' });

    const waitTimeSeconds = 120;
    console.log(`Waiting ${waitTimeSeconds} seconds for environment aws://${account}/${region} to be released...`);
    await session.waitFor(async () => (await session.fetchEnvironment(account, region)).Item === undefined, waitTimeSeconds);

  });

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}
