import { githubFetcher } from '../../services/github-fetcher'

export const rootValue = {
  repository: async ( { username, name, token }) => {
    try {
      // throttling
      const [data, webhooks, fileContent] = await Promise.all([
        githubFetcher.fetchRepository(username, name, token),
        githubFetcher.getWebhooks(username, name, token),
        githubFetcher.getFileContent(username, name, token)
      ]);

      const r = {
        name: data.name,
        size: data.size,
        isPrivate: data.private,
        //filesAmount,
        yamlFileContent: fileContent,
        owner: {
          login: data.owner.login,
          id: data.owner.id,
          avatarUrl: data.owner.avatar_url,
          url: data.owner.url,
        },
        activeWebhooks: webhooks?.map(item => ({
          type: item.type,
          id: item.id,
          name: item.name,
        })),
      };
      console.log('r', r);

      return r;
    } catch (err) {
      console.error(err);
      throw new Error('Error fetching repository details');
    }
  },
  repositories: async ({ username }) => {
    try {
      const data = await githubFetcher.fetchRepositories(username);
      return data.map((item) => ({
        name: item.name,
        size: item.size,
        owner: {
          login: item.owner.login,
          id: item.owner.id,
          avatarUrl: item.owner.avatar_url,
          url: item.owner.url,
        }
      }));
    } catch (err) {
      console.error(err);
      throw new Error('Error fetching repositories');
    }
  },
};
