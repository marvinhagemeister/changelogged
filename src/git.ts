import { exec } from "./util";

export function getRepo() {
  const originReg = /:([A-Za-z0-9]+\/[A-Za-z0-9]+)\.git$/;
  try {
    const raw = exec("git config --get remote.origin.url");

    originReg.lastIndex = 0;
    const m = originReg.exec(raw);
    return m ? m[1] : null;
  } catch (err) {
    throw new Error("No valid GitHub remote found");
  }
}

const reg = /^([a-z0-9]+)\s(\d+)\s(.*)/;
const prReg = /(?:Merge pull request #(\d+)|\(#(\d+)\)\s*$)/g;

export function parseCommit(input: string) {
  reg.lastIndex = 0;
  prReg.lastIndex = 0;

  const m = reg.exec(input);
  if (!m) return null;
  const m2 = prReg.exec(m[3]);

  return {
    hash: m[1],
    time: m[2],
    message: m[3],
    number: m2 ? parseInt(m2[1] || m2[2], 10) : null
  };
}

export function parseCommits(range: string) {
  const commits = exec(`git log --format="%H %ct %s" ${range}`)
    .split("\n")
    .map(parseCommit)
    .filter(Boolean);

  return {
    start: commits.length ? commits[0]!.time : 0,
    prs: commits.filter(x => x!.number !== null).map(x => x!.number)
  };
}
