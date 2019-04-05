import { execSync } from "child_process";
import { PRsRes as Pull } from "./api";

/**
 * Executes a shell comand and returns the raw cli output
 * @param cmd The command to execute
 */
export const exec = (cmd: string) =>
  execSync(cmd)
    .toString()
    .trim();

/**
 * Converts a typical timestamp to unix time
 * @param timestamp Timestamp to convert
 */
export const toTime = (timestamp: string) => new Date(timestamp).getTime();

export function formatPR(pr: Pull, format = "- %m (#%n, thanks @%a)") {
  return format
    .replace("%n", "" + pr.number)
    .replace("%m", pr.title)
    .replace("%a", pr.author.login);
}
