import { createFetch, fetchPRs, fetchSinglePR } from "./api";
import { parseArgs } from "./cli";
import { parseCommits, getRepo } from "./git";
import { formatPR, toTime } from "./util";
import { logWarn, logError, log } from "./logger";

async function run() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      console.log(`
🔍 Autogenerate a Changelog based on merged PRs

Usage:
  $ perfdoc [options] <file>

Options:
  --token, -t     GitHub API token to use (required)
  --help, -h      Show usage information and the options listed here
  --version, -v   Show version information
      `);
      return;
    } else if (args.version) {
      console.log(require("../package.json").version);
      return;
    }

    const repo = getRepo();

    const parsed = parseCommits(args._[0]);
    if (!parsed.prs.length) {
      throw new Error("No PRs found");
    }

    const found = new Set(parsed.prs);

    const fetch = createFetch(args.token, repo);
    const prs = await fetchPRs(fetch, repo, parsed.prs.length);
    prs.sort((a, b) => toTime(a.mergedAt) - toTime(b.mergedAt));

    prs.forEach(x => {
      if (!found.has(x.number)) {
        throw new Error(
          "Your current branch is not up to date with the remote\n"
        );
      }
      found.delete(x.number);
    });

    // If there are any remaining PR ids where we have no PR object we
    // need to query them separately. This happens when a branch was merged
    // into another PR
    const missed = await Promise.all(
      Array.from(found).map(id => fetchSinglePR(fetch, repo, id))
    );

    const formatted = prs
      .concat(missed.filter(Boolean))
      .map(formatPR)
      .join("\n");

    if (found.size > 0) {
      logWarn(
        "The following PRs could not be found: " + Array.from(found).join(", ")
      );
    } else {
      log(`PRs: ${prs.length}\n`);
      // eslint-disable-next-line no-console
      console.log(formatted);
    }
  } catch (err) {
    logError(err.message);
    process.exit(1);
  }
}

run();
