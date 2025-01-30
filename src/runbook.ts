const RUNBOOK_URL = 'https://github.com/cdklabs/cdk-atmosphere-service/blob/main/docs/operator-runbook.md';

export function anchor(heading: string) {
  return `${RUNBOOK_URL}#${heading}`;
}
