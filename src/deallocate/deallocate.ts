import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { DeallocateFunction } from './deallocate-function';
import { ENVIRONMENTS_TABLE_NAME_ENV, ALLOCATIONS_TABLE_NAME_ENV } from '../clients';
import { Allocations, Environments } from '../storage';

/**
 * Properties for `Deallocate`.
 */
export interface DeallocateProps {

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
 * Deallocate function.
 */
export class Deallocate extends Construct {

  public readonly function: lambda.Function;

  constructor(scope: Construct, id: string, props: DeallocateProps) {
    super(scope, id);

    this.function = new DeallocateFunction(this, 'Function');

    props.allocations.grantReadWrite(this.function);
    props.environments.grantReadWrite(this.function);

    this.function.addEnvironment(ENVIRONMENTS_TABLE_NAME_ENV, props.environments.table.tableName);
    this.function.addEnvironment(ALLOCATIONS_TABLE_NAME_ENV, props.allocations.table.tableName);

  }
}