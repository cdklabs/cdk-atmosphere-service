import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { DeallocateFunction } from './deallocate-function';
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
  }
}