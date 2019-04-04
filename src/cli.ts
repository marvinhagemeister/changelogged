import mri from "mri";

export interface CliArgs {
  _: string;
  help: boolean;
  version: boolean;
  repo: string;
}

export function parseArgs(argv: string[]): CliArgs {
  const args = (mri(argv, {
    boolean: ["help", "version"],
    alias: {
      h: "help",
      v: "version"
    }
  }) as any) as CliArgs;

  if (!args.help && !args.version) {
    if (!args._.length) {
      throw new Error(
        "Please specify a valid commit range in the form of mytag..HEAD"
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
  --help, -h      Show usage information and the options listed here
  --version, -v   Show version information

Examples:
  Get all PRs made starting from a git tag
  $ changelogged --token=123456789 v1.2.0..HEAD

  Get all PRs since commit "abc"
  $ changelogged --token=123456789 abc..HEAD
`;
