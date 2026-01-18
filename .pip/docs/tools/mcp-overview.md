# MCP Overview

Model Context Protocol (MCP) integrations used to develop and operate the app.

## Connections
- <tool/service>: endpoint, auth method, scopes
- Security: least privilege, rotate tokens, audit logs

## Example Prompts
```
You are the <agent>. Task: <goal>. Use <tools>. Output: <format>.
```

## Workflows
- Code review assistant: diff → checklist → summary → PR comments
- Release note generator: commits → changelog → blog draft
- Support triage: ticket → categorization → suggested responses

## Operational Notes
- Timeout/retry policies; rate limits
- Logging and redaction for sensitive data

