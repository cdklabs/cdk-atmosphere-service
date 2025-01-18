// eslint-disable-next-line import/no-extraneous-dependencies
import * as ddb from '@aws-sdk/client-dynamodb';

export function optionalValue(name: string, attributes: Record<string, ddb.AttributeValue>) {
  const attribute = attributes[name];
  if (attribute) {
    return attribute.S;
  }
  return undefined;
}

export function requiredValue(name: string, attributes: Record<string, ddb.AttributeValue>) {
  const v = optionalValue(name, attributes);
  if (!v) {
    throw new Error(`Attribute '${name}' not found`);
  }
  return v;
}