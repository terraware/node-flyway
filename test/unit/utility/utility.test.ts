import {describe, it} from 'mocha';
import {expect} from 'chai';
import {execute} from '../../../src/utility/utility';
import {ExecOptions} from 'node:child_process';

describe('execute', () => {
    it('should parse stdout even when process exits with failure', async () => {
        // Mock exec function that simulates a failed process with JSON output in stdout
        const mockExec = (
            command: string,
            options: ExecOptions,
            callback: (error: Error | null, stdout: string | Buffer, stderr: string | Buffer) => void
        ) => {
            const error = new Error('Command failed with exit code 1') as any;
            error.code = 1;

            const jsonOutput = JSON.stringify({
                "error": {
                    "errorCode": "ERROR",
                    "message": "Migration failed"
                },
                "success": false,
                "operation": "migrate"
            });

            // Simulate process failure but with JSON output in stdout
            callback(error, jsonOutput, '');

            return {} as any; // Return mock ChildProcess
        };

        const result = await execute('flyway migrate -outputType=json', {}, mockExec as any);

        expect(result.success).to.be.false;
        expect(result.response).to.equal(JSON.stringify({
            "error": {
                "errorCode": "ERROR",
                "message": "Migration failed"
            },
            "success": false,
            "operation": "migrate"
        }));
    });

    it('should parse stdout when process exits successfully', async () => {
        // Mock exec function that simulates a successful process
        const mockExec = (
            command: string,
            options: ExecOptions,
            callback: (error: Error | null, stdout: string | Buffer, stderr: string | Buffer) => void
        ) => {
            const jsonOutput = JSON.stringify({
                "success": true,
                "operation": "migrate",
                "migrationsExecuted": 2
            });

            // Simulate successful execution
            callback(null, jsonOutput, '');

            return {} as any; // Return mock ChildProcess
        };

        const result = await execute('flyway migrate -outputType=json', {}, mockExec as any);

        expect(result.success).to.be.true;
        expect(result.response).to.equal(JSON.stringify({
            "success": true,
            "operation": "migrate",
            "migrationsExecuted": 2
        }));
    });

    it('should handle stdout as Buffer', async () => {
        // Mock exec function that returns Buffer instead of string
        const mockExec = (
            command: string,
            options: ExecOptions,
            callback: (error: Error | null, stdout: string | Buffer, stderr: string | Buffer) => void
        ) => {
            const error = new Error('Command failed') as any;
            const jsonOutput = Buffer.from(JSON.stringify({
                "error": {
                    "errorCode": "ERROR",
                    "message": "Test error"
                }
            }));

            callback(error, jsonOutput, Buffer.from(''));

            return {} as any;
        };

        const result = await execute('flyway info -outputType=json', {}, mockExec as any);

        expect(result.success).to.be.false;
        expect(result.response).to.equal(JSON.stringify({
            "error": {
                "errorCode": "ERROR",
                "message": "Test error"
            }
        }));
    });
});
