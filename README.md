# Changelogged

This is a simple module to autogenerate a list of merged PRs in a given commit range. After trying out various existing CLI tools or Web-Apps I didn't find one that worked or matched the formatting style that we use for [Preact](https://github.com/developit/preact/). It's something that I quickly hacked together to make my life easier when creating the release notes.

People kept asking me what tool I use, so I spent 2 evenings adding proper error handling and converting it into a proper module. It's by no means perfect and doesn't support advanced features or anything, but it does the job for me. I mainly published it because it may prove to be useful for other OSS peers. I'm open to accept PRs though, if somebody wants to add that.

_Note: It's limited to 100 possible entries in a range and you need a valid [GitHub API token](https://developer.github.com/v4/guides/forming-calls/#authenticating-with-graphql) to be able to use this module._

## Usage

```bash
npm install -g changelogged
# or via yarn
yarn add -g changelogged
```

Then `cd` in your git repository and run `changelogged <tagOrCommit>..HEAD`. Enter your GitHub Token et voilà!

Example output:

```bash
GitHub: developit/preact
PRs: 3

- move JSX namespace into preact one (#1448, thanks @just-boris)
- Remove unused component import (#1508, thanks @marvinhagemeister)
- (fix) - debug message should not throw for undefined and null (#1505, thanks @JoviDeCroock)
```

Full cli args:

```bash
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

  --help, -h      Show usage information and the options listed here
  --version, -v   Show version information

Examples:
  Get all PRs made starting from a git tag
  $ changelogged v1.2.0..HEAD

  Get all PRs since commit "abc"
  $ changelogged abc..HEAD

  Format output:
  $ changelogged --format='PR: %n, msg: %m, author: %a' v1..HEAD
```

## License

`MIT`, see [the license file](./LICENSE.md).
