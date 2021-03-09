import mri from "mri";

export interface CliArgs {
  _: string;
  help: boolean;
  version: boolean;
  format: string;
  token: string;
}

export function parseArgs(argv: string[]): CliArgs {
  const args = (mri(argv, {
    string: ["format", "token"],
    boolean: ["help", "version"],
    alias: {
      f: "format",
      h: "help",
      t: "token",
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
  --format, -f    Format changelog entry. The following special characters
                  will be replaced:

                  %n = PR number
                  %m = Commit message (1st line)
                  %a = PR author

                  The default is: '- %m (#%n, thanks @%a)'

  --token, -t     GitHub token to use for fetching repository data
  --help, -h      Show usage information and the options listed here
  --version, -v   Show version information

Examples:
  Get all PRs made starting from a git tag
  $ changelogged v1.2.0..HEAD

  Get all PRs since commit "abc"
  $ changelogged abc..HEAD

  Format output:
  $ changelogged --format='PR: %n, msg: %m, author: %a' v1..HEAD
`;
