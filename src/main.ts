import * as core from '@actions/core'

async function run(): Promise<void> {
    try {
        core.setOutput("Hello", "World");
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();