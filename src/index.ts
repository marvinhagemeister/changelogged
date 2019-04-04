import { createFetch, fetchPRs, fetchSinglePR } from "./api";
import { parseArgs, help } from "./cli";
import { parseCommits, getRepo } from "./git";
import { formatPR, toTime } from "./util";
import { green } from "kleur";
import { logError, log } from "./logger";
import readline from "readline-sync";

async function run() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      console.log(help);
      return;
    } else if (args.version) {
      console.log(require("../package.json").version);
      return;
    }

    const token = readline.question("Paste your GitHub API token: ", {
      hideEchoBack: true
    });

    const repo = getRepo();
    if (!repo) throw new Error("Could not detect repo name");
    log("GitHub: " + green(repo));

    const parsed = parseCommits(args._[0]);
    if (!parsed.prs.length) {
      throw new Error("No PRs found in the specified range");
    }

    const found = new Set(parsed.prs);

    const fetch = createFetch(token, repo);
    let prs = await fetchPRs(fetch, repo, parsed.prs.length);
    prs = prs.filter(x => found.has(x.number));
    prs.forEach(x => found.delete(x.number));

    // If there are any remaining PR ids where we have no PR object we
    // need to query them separately. This happens when a branch was merged
    // into another PR
    const missed = await Promise.all(
      Array.from(found)
        .filter(Boolean)
        .map(id => fetchSinglePR(fetch, repo, id!))
    );

    prs = prs
      .concat(missed.filter(Boolean))
      .sort((a, b) => toTime(a.mergedAt) - toTime(b.mergedAt))
      .reverse();

    log("PRs: " + green(prs.length));

    console.error();
    console.log(prs.map(formatPR).join("\n"));
  } catch (err) {
    logError(err.message);
    process.exit(1);
  }
}

run();
