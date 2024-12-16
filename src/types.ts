/**
 * Registered Environment.
 */
export interface RegisteredEnvironment {

  /**
   * Account ID.
   */
  readonly account: string;

  /**
   * Region.
   */
  readonly region: string;

  /**
   * Which pool does this environment belong to.
   */
  readonly pool: string;

  /**
   * ARN of an Admin role in the account. This role must be pre-created
   * and allow the service to assume it.
   */
  readonly adminRoleArn: string;

}