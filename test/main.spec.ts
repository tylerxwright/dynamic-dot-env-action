import { run } from '../src/main';
import * as process from 'process';
import * as childProcess from 'child_process';
import * as path from 'path';

describe('test should work', () => {
    it("should work", () => {
        const execPath = process.execPath;
        const testPath = path.join(__dirname, '..', 'lib', 'main.js');
        const options: childProcess.ExecFileSyncOptions = {};
        console.log(childProcess.execFileSync(execPath, [testPath], options).toString());
    });
});