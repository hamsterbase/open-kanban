export interface IssueItem {
  title: string;
  priority: number;
  priorityLabel: string;
  projectLabel: string | null;
  state: { position: number; name: string };
}

export type IssueStateWithIssue = {
  position: number;
  title: string;
  issues: Array<Omit<IssueItem, "state">>;
};

/**
 * 1. state sort by position asc
 * 2. issue sort by priority desc
 *
 * @param issue issue list
 * @returns issue state with issue
 */
export function getIssueStateWithIssue(
  issue: IssueItem[]
): IssueStateWithIssue[] {
  const stateMap = new Map<string, IssueStateWithIssue>();
  issue.forEach((item) => {
    const { state, ...rest } = item;
    const stateKey = state.name;
    if (!stateMap.has(stateKey)) {
      stateMap.set(stateKey, {
        title: stateKey,
        issues: [rest],
        position: state.position,
      });
    } else {
      const issueStateWithIssue = stateMap.get(stateKey);
      issueStateWithIssue?.issues.push(rest);
    }
  });
  return Array.from(stateMap.values())
    .sort((a, b) => {
      return a.position - b.position;
    })
    .map((item) => {
      return {
        ...item,
        issues: item.issues.sort((a, b) => {
          return a.priority - b.priority;
        }),
      };
    });
}
