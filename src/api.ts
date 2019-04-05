import { post } from "httpie";

/**
 * Create an easy to use Promise-based function to query the backend
 * @param token GitHub app token
 * @param repo Name of the repository
 */
export const createFetch = (token: string, repo: string) => (query: string) => {
  return post("https://api.github.com/graphql", {
    headers: {
      Authorization: "bearer " + token,
      "Content-Type": "application/json",
      "User-Agent": repo // Required
    },
    body: JSON.stringify({
      query: query.replace(/[\n]/g, "")
    })
  }).then(res => res.data);
};

export interface PRsRes {
  mergedAt: string;
  author: {
    login: string;
  };
  title: string;
  number: number;
}

export async function fetchPRs(
  request: (query: string) => any,
  repo: string,
  count: number
): Promise<PRsRes[]> {
  const [owner, name] = repo.split("/");

  // GitHub has a limit of 100 items per page
  if (count > 100) {
    throw new Error(
      "Support for fetching more than 100 PRs is currently not supported"
    );
  }
  const data = await request(`
		{
			repository(name: "${name}", owner: "${owner}") {
				pullRequests(states: MERGED, last: ${count}, orderBy: {field: CREATED_AT, direction: ASC}) {
					nodes {
						mergedAt
						author {
							login
						}
						title
						number
					}
				}
			}
		}
  `);

  return data.data.repository.pullRequests.nodes;
}

export async function fetchSinglePR(fetch: any, repo: string, id: number) {
  const [owner, name] = repo.split("/");
  const data = await fetch(`
			{
				repository(name: "${name}", owner: "${owner}") {
					pullRequest(number: ${id}) {
						mergedAt
						author {
							login
						}
						title
						number
					}
				}
			}
    `);

  if (data.errors) {
    const type = await fetchType(fetch, repo, id);
    if (type === "PullRequest") {
      throw new Error(`PR #${id} not found`);
    }
    return null;
  }

  return data.data.repository.pullRequest;
}

export async function fetchType(fetch: any, repo: string, id: number) {
  const [owner, name] = repo.split("/");
  const data = await fetch(`
			{
				repository(name: "${name}", owner: "${owner}") {
					issueOrPullRequest(number: ${id}) {
						__typename
					}
				}
			}
    `);

  return data.data.repository.issueOrPullRequest.__typename;
}
