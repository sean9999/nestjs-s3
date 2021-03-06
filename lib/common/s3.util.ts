import { S3ConfigOptions } from "../interfaces/s3-options.interface";
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import * as https from 'https';

const defaultEndpoint = (options: S3ConfigOptions): string => {
    const region = options.region || 'us-east-1';
    return `https://s3.${region}.amazonaws.com`;
};

export function createS3Client(options: S3ConfigOptions): S3 {
    AWS.config.update({
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
        sessionToken: options?.sessionToken,
        region: options.region
    });
    if (options.maxSockets) {
        AWS.config.update({
            httpOptions: {
                agent: new https.Agent({
                    maxSockets: options.maxSockets
                })
            }
        });
    }
    let apiVersion = options.apiVersion === undefined ? '2006-03-01' : options.apiVersion;
    let endpoint = options.endpoint || defaultEndpoint(options);
    let params: S3.ClientConfiguration = {
        apiVersion,
        endpoint
    };
    const client = new S3(params);
    return client;
}
