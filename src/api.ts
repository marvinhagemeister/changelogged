import { yellow } from "kleur";
import fetch from "node-fetch";

/**
 * Create an easy to use Promise-based function to query the backend
 * @param token GitHub app token
 * @param repo Name of the repository
 */
export const createFetch = (token: string, repo: string) => (query: string) => {
  console.log(repo);
  return fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: "bearer " + token,
      "Content-Type": "application/json",
      "User-Agent": repo // Required
    },
    body: JSON.stringify({
      query: query.replace(/[\n]/g, "")
    })
  }).then(res => res.json());
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
) {
  const [owner, name] = repo.split("/");
  console.log(name, owner, count);

  const pulls: PRsRes[] = [];

  // GitHub has a limit of 100 items per page
  for (let i = 0; i < count; i += 100) {
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

    pulls.push(...data.data.repository.pullRequests.nodes);
  }

  return pulls;
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
    console.warn(
      yellow("PR not found, maybe that's a GitHub issue instead?: " + id)
    );
    return null;
  }

  return data.data.repository.pullRequest;
}
