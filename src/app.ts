import { writeFile } from 'fs';
import { debug, error, getInput, setFailed } from '@actions/core';
import { create } from '@actions/artifact';
import { getOctokit } from '@actions/github';
import { exec } from '@actions/exec';

createDotEnv().catch((error) => setFailed(error.message));

export async function createDotEnv(): Promise<void> {

    try {
        const environment: string = getInput('environment');
        const token: string = getInput('github_token');
        const repoOwner: string = getInput('repo_owner');
        const repoName: string = getInput('repo_name');
        const appendFile: string = getInput('append_file');
        const envFilename: string = getInput('env_filename');

        const octokit = getOctokit(token);

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
            envFile += `${secret.name}=$\{{ ${secret.name} }}`;
        });

        if(appendFile) {
            envFile += appendFile;
        }

        debug(envFile);

        writeFile(envFilename, envFile, (err) => {
            if(err) {
                error(`File write error: ${err}`);
                return;
            }

            exec('ls', ['-la']);

            const artifactClient = create();
            const files = [
                envFilename
            ];
            artifactClient.uploadArtifact('dynamic-dot-env-artifact', files, '/');
        });

    } catch (err) {
        error(`Top level error: ${err}`);
        setFailed(err);
    }
}