// eslint-disable-next-line import/no-extraneous-dependencies
import * as ddb from '@aws-sdk/client-dynamodb';

export function value(name: string, attributes: Record<string, ddb.AttributeValue>) {
  const attribute = attributes[name];
  if (!attribute) {
    throw new Error(`Attribute '${name}' not found`);
  }
  if (attribute.S) {
    return attribute.S;
  }
  throw new Error(`Attribute '${name}' does not have a value`);
}