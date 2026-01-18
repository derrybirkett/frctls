# Agent Monitoring Dashboard

## Key Metrics to Track

- **PRs Created**: The number of pull requests created by the agent.
- **Review Pass Rate**: The percentage of PRs that pass review without requiring significant revisions.
- **Cost Per Task**: The average cost of executing a task by the agent.

## Example Queries using `gh` CLI

To track the number of PRs created by the agent:
```
gh pr list --search "author:agent_username"
```

To calculate the review pass rate:
```
gh pr list --search "author:agent_username merged:<date>" --json mergeCommit,reviewDecision
```

## Cost Monitoring

Monitor your costs associated with the agent's operations by visiting the OpenAI dashboard. Ensure you're logged in to view your usage and associated costs.

[OpenAI Dashboard Link](https://platform.openai.com/account/billing)

## Troubleshooting Tips

- **Issue**: Agent is not creating PRs as expected.
  **Solution**: Verify the agent's permissions and ensure it has access to create PRs in the repository.

- **Issue**: High cost per task.
  **Solution**: Review the tasks being automated to ensure they are necessary and efficiently designed. Consider optimizing the agent's algorithms or reducing the frequency of task execution.