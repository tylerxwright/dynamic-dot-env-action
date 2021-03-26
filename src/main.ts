import * as core from '@actions/core'
import * as github from '@actions/github'
import * as dotenv from "dotenv";

async function run(): Promise<void> {
    dotenv.config();

    try {
        const environment: string = process.env.GITHUB_ENVIRONMENT || core.getInput('environment');
        const token: string = process.env.GITHUB_TOKEN || core.getInput('token');

        const octokit = github.getOctokit(token);

        const repo = await octokit.repos.get({
            owner: 'tylerxwright',
            repo: 'dynamic-dot-env-action'
        });

        const envSecrets = await octokit.actions.listEnvironmentSecrets({
            repository_id: repo.data.id,
            environment_name: environment
        });

        core.info("Logging secret names");
        for(const secret of envSecrets.data.secrets) {
            core.info(secret.name);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();