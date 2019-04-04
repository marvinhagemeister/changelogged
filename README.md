# Changelogged

This is a simple module to autogenerate a list of merged PRs in a given commit range. After trying out various existing CLI tools or Web-Apps I didn't find one that worked or matched the formatting style that we use for [Preact](https://github.com/developit/preact/). It's something that I quickly hacked together to make my life easier when creating the release notes.

People kept asking me what tool I use, so I spent 2 evenings adding proper error handling and converting it into a proper module. It's by no means perfect and doesn't support advanced features like custom formatting or anything, but it does the job for me. I mainly published it because it may prove to be useful for other OSS peers. I'm open to accept PRs though, if somebody wants to add that.

_Note: It's limited to 100 possible entries in a range and ou need a valid [GitHub API token](https://developer.github.com/v4/guides/forming-calls/#authenticating-with-graphql) to be able to use this module._

## Usage

```bash
npm install -g changelogged
# or via yarn
yarn add -g changelogged
```

Then `cd` in your git repository and run `changelogged <tagOrCommit>..HEAD`. Enter your GitHub Token et voilà!

```bash
🔍 Autogenerate a Changelog based on merged PRs

Usage:
  $ changelogged [options] <range>

Options:
  --help, -h      Show usage information and the options listed here
  --version, -v   Show version information

Examples:
  Get all PRs made starting from a git tag
  $ changelogged v1.2.0..HEAD

  Get all PRs since commit "abc"
  $ changelogged abc..HEAD
```

## License

`MIT`, see [the license file](./LICENSE.md).