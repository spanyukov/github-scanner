import { buildSchema } from 'graphql';

export const schema = buildSchema(`
    type Query {
        repositories(username: String!): [RepositoryListItem]
        repository(username: String!, name: String!, token: String!): Repository
    }

    input RepoRequest {
      name: String!
      owner: String!
      token: String!
    }
    
    input ReposRequest {
      owner: String!
    }

    type Repository {
        name: String
        size: String
        owner: Owner
        isPrivate: Boolean
        filesAmount: Int
        yamlFileContent: String
        activeWebhooks: [Webhook]
    }

    type RepositoryListItem {
        name: String
        size: String
        owner: Owner
    }

    type Owner {
      login: String
      id: Int
      avatarUrl: String
      url: String
    }
    
    type Webhook {
      type: String
      id: Int
      name: String
    }

`);