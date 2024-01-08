import { Issue, LinearClient } from "@linear/sdk";
import pLimit from "p-limit";
import { IssueItem } from "./common";

async function getLabeIdByName(
  sdk: LinearClient,
  name: string
): Promise<string | null> {
  const { nodes } = await sdk.issueLabels({});
  const label = nodes.find((item) => item.name === name);
  if (label) {
    return label.id;
  }
  return null;
}

async function getProjectIdNotInState(sdk: LinearClient, stateList: string[]) {
  const { nodes } = await sdk.projects();
  const projectList = nodes.filter((item) => {
    return !stateList.includes(item.state);
  });

  return projectList.map((item) => item.id);
}

interface GetLinerIssueOptions {
  apiKey: string;
  projectState: string[];
  issueLimit: number;
  requestLimit: number;
  label: string;
}

async function getIssueItemFromLinearIssue(
  issue: Issue
): Promise<IssueItem | null> {
  const [state, project] = await Promise.all([issue.state, issue.project]);
  if (!state) {
    return null;
  }
  return {
    title: issue.title,
    priority: issue.priority === 0 ? 999 : issue.priority,
    priorityLabel: issue.priorityLabel,
    projectLabel: project?.name ?? null,
    state: { position: state.position, name: state.name },
  };
}

export const getLinearIssues = async (options: GetLinerIssueOptions) => {
  const sdk = new LinearClient({
    apiKey: options.apiKey,
  });
  const projectIds = await getProjectIdNotInState(sdk, options.projectState);

  const labelId = await getLabeIdByName(sdk, options.label);
  if (!labelId) {
    console.log("label not found");
    return [];
  }
  const { nodes } = await sdk.issues({
    first: options.issueLimit,
    filter: {
      project: {
        id: {
          nin: projectIds,
        },
      },
      labels: {
        id: {
          in: [labelId],
        },
      },
    },
  });
  const limit = pLimit(options.requestLimit);
  const issueList = (
    await Promise.all(
      nodes.map((item) => {
        return limit(() => getIssueItemFromLinearIssue(item));
      })
    )
  ).filter((item) => item !== null) as IssueItem[];
  return issueList;
};
