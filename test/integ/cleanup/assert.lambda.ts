import { Session } from '../service.session';

export async function handler(_: any) {

  return Session.assert(async (session: Session) => {
    const allocateResponse = await session.allocate({ pool: 'release', requester: 'test' } );
    const body = JSON.parse(allocateResponse.body!);

    await session.deallocate(body.id, { outcome: 'success' });

  });

}

// allows running the handler locally with ts-node
if (Session.isLocal()) {
  void handler({});
}
