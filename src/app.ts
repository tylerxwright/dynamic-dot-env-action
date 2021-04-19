import * as core from '@actions/core';
import { getOctokit } from '@actions/github';
//import * as sodium from 'tweetsodium';

createDotEnv().catch((error) => core.setFailed(error.message));

export async function createDotEnv(): Promise<void> {

    try {
        // convert this to an object
        const environment = core.getInput('environment');
        const token = core.getInput('github_token');
        const repoOwner = core.getInput('repo_owner');
        const repoName = core.getInput('repo_name');
        const appendFile = core.getInput('append_file');
        const preWrapper = core.getInput('pre_wrapper');
        const postWrapper = core.getInput('post_wrapper');
        
        if(token === '') {
            throw new Error('GITHUB_TOKEN is required');
        }

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
            envFile += secret.name+'='+preWrapper+' secrets.'+secret.name+' '+postWrapper+'\n';
        });

        if(appendFile) {
            envFile += appendFile;
        }

        core.setOutput('dynamic_dot_env_data', envFile);
        //createSecret('DYNAMIC_DOT_ENV_DATA', envFile, octokit, repo, environment);
    } catch (err) {
        core.error(`Top level error: ${err}`);
        core.setFailed(err);
    }
}

// async function createSecret(secretName: string, secretValue: string, octokit: any, repo: any, environment: string) {
//     const publicKeyResponse = await octokit.actions.getEnvironmentPublicKey({
//         repository_id: repo.data.id,
//         environment_name: environment
//     });

//     const encryptedSecret = encryptSecret(publicKeyResponse.data.key, secretValue);

//     octokit.actions.createOrUpdateEnvironmentSecret({
//         key_id: publicKeyResponse.data.key_id,
//         repository_id: repo.data.id,
//         environment_name: environment,
//         secret_name: secretName,
//         encrypted_value: encryptedSecret
//     });
// }

// function encryptSecret(key: string, value: string): string {

//     const messageBytes = Buffer.from(value);
//     const keyBytes = Buffer.from(key, 'base64');

//     const encryptedBytes = sodium.seal(messageBytes, keyBytes);

//     const encrypted = Buffer.from(encryptedBytes).toString('base64');
//     return encrypted;
// }
