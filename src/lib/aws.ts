import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@/config/aws";


export const uploadAvatar = async (uid: string, file: Buffer, mimeType: string) => {
    try {
        console.log('avatar data', uid, file, mimeType)
        const key = `${uid}.png`;

        const input = {
            Bucket: process.env.AWS_S3_BUCKET_NAME as string,
            Key: key,
            Body: file,
            ContentType: mimeType,
        };
        console.log('input', input)

        const command = new PutObjectCommand(input);
        console.log('command', command)
        const res = await s3.send(command);

        console.log('res', res)

        return res;
    } catch (e) {
        throw e;
    };
};

export const getAvatar = async (uid: string) => {
    try {
        const key = `avatars/${uid}.png`;
        const input = {
            Bucket: process.env.AWS_S3_BUCKET_NAME as string,
            Key: key
        };

        const command = new GetObjectCommand(input);
        const res = s3.send(command);

        console.log('aws res', res)

        return res;
    } catch (e) {
        throw e;
    };
};

export const deleteAvatar = async (uid: string) => {
    try {
        const key = `avatars/${uid}.png`;

        const input = {
            Bucket: process.env.AWS_S3_BUCKET_NAME as string,
            Key: key
        };

        const command = new DeleteObjectCommand(input);
        const res = await s3.send(command);

        return res;
    } catch (e) {
        throw e;
    };
};