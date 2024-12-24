import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { AllocateFunction } from './allocate-function';
import {
  CONFIGURATION_BUCKET_ENV,
  CONFIGURATION_KEY_ENV,
  ALLOCATIONS_TABLE_NAME_ENV,
  ENVIRONMENTS_TABLE_NAME_ENV,
} from '../clients';
import { Configuration } from '../config';
import { Allocations, Environments } from '../storage';

/**
 * Properties for `Allocate`.
 */
export interface AllocateProps {

  /**
   * Service configuration.
   */
  readonly configuration: Configuration;

  /**
   * Allocations storage.
   */
  readonly allocations: Allocations;

  /**
   * Environments storage.
   */
  readonly environments: Environments;
}

/**
 * Allocate function.
 */
export class Allocate extends Construct {

  public readonly function: lambda.Function;

  constructor(scope: Construct, id: string, props: AllocateProps) {
    super(scope, id);

    this.function = new AllocateFunction(this, 'Function');

    props.configuration.grantRead(this.function);
    props.environments.grantReadWrite(this.function);
    props.allocations.grantReadWrite(this.function);

    this.function.addEnvironment(CONFIGURATION_BUCKET_ENV, props.configuration.bucket.bucketName);
    this.function.addEnvironment(CONFIGURATION_KEY_ENV, props.configuration.key);
    this.function.addEnvironment(ENVIRONMENTS_TABLE_NAME_ENV, props.environments.table.tableName);
    this.function.addEnvironment(ALLOCATIONS_TABLE_NAME_ENV, props.allocations.table.tableName);

  }
}