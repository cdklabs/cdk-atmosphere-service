"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/deallocate/deallocate.lambda.ts
var deallocate_lambda_exports = {};
__export(deallocate_lambda_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(deallocate_lambda_exports);
async function handler(event) {
  console.log("Event:", JSON.stringify(event, null, 2));
  const allocationId = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Successfully deallocated ${allocationId}` })
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
