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
