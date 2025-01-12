// eslint-disable-next-line import/no-extraneous-dependencies
import { ECR } from '@aws-sdk/client-ecr';

export interface DeleteOptions {
  readonly repositoryName: string;
  readonly timeoutDate: Date;
}
export class EcrCleaner {

  public constructor(private readonly ecr: ECR) {}

  public async delete(opts: DeleteOptions) {

  }
}