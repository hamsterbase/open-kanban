import { IssueInstanceCache } from "@/issue/cache";
import { IssueItem, getIssueStateWithIssue } from "@/issue/common";
import styles from "@/styles/Home.module.css";
import { AppContext } from "next/app";
import { useMemo } from "react";

interface HomeProps {
  issueItems: IssueItem[];
}

export default function Home(props: HomeProps) {
  const issueState = useMemo(() => {
    return getIssueStateWithIssue(props.issueItems);
  }, [props.issueItems]);
  return (
    <div className={styles.content}>
      {issueState.map((state) => {
        return (
          <div key={state.position} className={styles.column}>
            <div className={styles.stateTitle}>
              {state.title}
              <span className={styles.stateTitleCount}>
                {state.issues.length}
              </span>
            </div>
            <div className={styles.stateContent}>
              {state.issues.map((issue) => {
                return (
                  <div key={issue.title} className={styles.issue}>
                    <div className={styles.issueTitle}>{issue.title}</div>
                    <div className={styles.issueLabelContainer}>
                      <div className={styles.issueLabel}>
                        {issue.priorityLabel}
                      </div>
                      {issue.projectLabel && (
                        <div className={styles.issueLabel}>
                          {issue.projectLabel}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

let issueCache: IssueInstanceCache | null;
export const getServerSideProps = async (context: any) => {
  if (!issueCache) {
    issueCache = new IssueInstanceCache();
  }
  const forceReloadToken = context.query.forceReloadToken;
  return {
    props: {
      issueItems: await issueCache.getIssueList({
        forceReloadToken,
      }),
    },
  };
};
