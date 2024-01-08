import getConfig from "next/config";
import { tmpdir } from "os";
import { resolve } from "path";
import { IssueItem } from "./common";
import fs from "fs/promises";
import { getLinearIssues } from "./linear";

export class IssueInstanceCache {
  private getIssueTask: Promise<IssueItem[]> | null = null;

  async getIssueList(options: {
    forceReloadToken: string;
  }): Promise<IssueItem[]> {
    const {
      publicRuntimeConfig: { version },
    } = getConfig();
    const cacheFile = resolve(tmpdir(), `issues-cache-${version}.json`);
    const shouldForceReload =
      !!process.env.FORCE_RELOAD_TOKEN &&
      options.forceReloadToken === process.env.FORCE_RELOAD_TOKEN;
    if (shouldForceReload) {
      console.log("Force reload");
      await fs.unlink(cacheFile).catch(() => {});
    }
    try {
      const cache = await fs.readFile(cacheFile, "utf-8");
      const { time, data } = JSON.parse(cache);
      if (Date.now() - time > 1000 * 60 * 60 * 1) {
        if (!this.getIssueTask) {
          this.getIssueTask = this.getLinearIssues(cacheFile).finally(() => {
            this.getIssueTask = null;
          });
        }
      }
      return data;
    } catch (error) {
      if (!this.getIssueTask) {
        this.getIssueTask = this.getLinearIssues(cacheFile).finally(() => {
          this.getIssueTask = null;
        });
      }
      return this.getIssueTask;
    }
  }

  private async getLinearIssues(cacheFile: string) {
    const apiKey = process.env.LINEAR_API_KEY!;
    if (!apiKey) {
      console.log("No Linear API Key");
      return [];
    }
    const issues = await getLinearIssues({
      apiKey,
      label: "Public",
      projectState: ["started", "planned", "paused", "backlog"],
      issueLimit: 100,
      requestLimit: 10,
    });
    await fs.writeFile(
      cacheFile,
      JSON.stringify({ time: Date.now(), data: issues })
    );
    return issues;
  }
}
