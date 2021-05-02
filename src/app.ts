import * as core from '@actions/core';
import { getOctokit } from '@actions/github';

createDotEnv().catch((error) => core.setFailed(error.message));

export async function createDotEnv(): Promise<void> {

    try {
        const repoOwner = core.getInput('repo_owner');
        const repoName = core.getInput('repo_name');
        const environment = core.getInput('environment');
        const githubToken = core.getInput('github_token');
        const secretPrefix = core.getInput('secret_prefix');
        const appendFile = core.getInput('append_file');
        const preWrapper = core.getInput('pre_wrapper');
        const postWrapper = core.getInput('post_wrapper');
        
        if(githubToken === '') {
            throw new Error('github_token is required');
        }

        const octokit = getOctokit(githubToken);

        const repo = await octokit.repos.get({
            owner: repoOwner,
            repo: repoName
        });

        const envSecrets = await octokit.actions.listEnvironmentSecrets({
            repository_id: repo.data.id,
            environment_name: environment
        });

        let envFile = '';
        envSecrets.data.secrets.forEach((secret) => {
            if(secret.name.startsWith(secretPrefix)) {
                envFile += secret.name+'='+preWrapper+' secrets.'+secret.name+' '+postWrapper+'\n';
            }
        });

        if(appendFile) {
            envFile += appendFile;
        }

        core.setOutput('dynamic_dot_env_data', envFile);
    } catch (err) {
        core.error(`Top level error: ${err}`);
        core.setFailed(err);
    }
}
