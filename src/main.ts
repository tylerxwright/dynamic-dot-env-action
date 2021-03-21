import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
    try {
        const token = core.getInput('github_token');
        const octokit = github.getOctokit(token);

        const repo = await octokit.repos.get({
           owner: 'tylerxwright',
           repo: 'dynamic-dot-env-action'
        });

        const envSecrets = await octokit.actions.listEnvironmentSecrets({
            repository_id: repo.data.id,
            environment_name: 'dev'
        });

        for(const secret of envSecrets.data.secrets) {
            core.info(secret.name);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();