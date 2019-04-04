import mri from "mri";

export interface CliArgs {
  _: string;
  help: boolean;
  version: boolean;
  token: string;
  repo: string;
}

export function parseArgs(argv: string[]): CliArgs {
  const args = (mri(argv, {
    string: ["token"],
    boolean: ["help", "version"],
    alias: {
      t: "token",
      h: "help",
      v: "version"
    }
  }) as any) as CliArgs;

  if (!args.help && !args.version) {
    if (typeof args.token !== "string" || !args.token.length) {
      throw new Error("Please pass a valid GitHub token via --token <token>.");
    }

    if (!args._.length) {
      throw new Error(
        "Please specify a valid commit range in the form of HEAD..mytag"
      );
    }
  }

  return args;
}

export const help = `
🔍 Autogenerate a Changelog based on merged PRs

Usage:
  $ changelogged [options] <range>

Options:
  --token, -t     GitHub API token to use (required)
  --help, -h      Show usage information and the options listed here
  --version, -v   Show version information

Examples:
  Get all PRs made starting from a git tag
  $ changelogged --token=123456789 v1.2.0..HEAD

  Get all PRs since commit "abc"
  $ changelogged --token=123456789 abc..HEAD
`;
