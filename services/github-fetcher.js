import {Octokit} from '@octokit/core';
import {Octokit as OctokitRest} from '@octokit/rest';


export const githubFetcher = {
    async fetchRepositories(username) {
        try {
            const octokit = new Octokit();
            const {data} = await octokit.request('GET /users/{username}/repos', {
                username,
            });
            console.log(data);
            return data;
        } catch (e) {
            console.log(e);
            throw new Error('Internal error');
        }
    },

    async fetchRepository(username, name, token) {
        try {
            const octokit = new Octokit({ auth: token });
            const {data} = await octokit.request('GET /repos/{owner}/{repo}', {
                owner: username,
                repo: name
            });

            return data;
        } catch (e) {
            console.log(e);
            throw new Error('Internal error');
        }
    },

    async getFileContent(username, name, token) {
        try {
            const octokit = new OctokitRest({ auth: token });
            const { data } = await octokit.rest.search.code({
                q: `q=extension:yml repo:${username}/${name}`,
            });

            if (!data?.items.length) {
                return;
            }

            const { content } = await octokit.rest.repos.getContent( {
                owner: username,
                repo: name,
                path: data.items[0].path,
            });

            return content;
        } catch (e) {
            console.log(e);
            throw new Error('Internal error');
        }
    },

    async getWebhooks(username, name, token, path) {
        try {
            const octokit = new Octokit({ auth: token });
            const { data } = await octokit.request('GET /repos/{owner}/{repo}/hooks', {
                owner: username,
                repo: name
            });

            return data.filter(item => item.active);
        } catch (e) {
            console.log(e);
            throw new Error('Internal error');
        }
    }


}