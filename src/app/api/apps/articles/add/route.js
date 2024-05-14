import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import { writeFile } from "fs/promises";

const db = new PrismaClient();

export const POST = async (req) => {
    try {
        const data = await req.formData();

        let thumbnailPath = null;

        const image = data.get('thumbnail');

        if (image) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const Path = `public/uploads/articles/${image.name}`;
            await writeFile(Path, buffer);
            thumbnailPath = Path;
        }
        else {
            thumbnailPath = '/public/uploads/articles/no-image.jpg';
        }

        const topic = data.get('topic');
        const source = data.get('source');
        const author = data.get('author');
        const youtubeLink = data.get('youtubeLink');
        const condition = data.get('condition');
        const status = data.get('status');
        const shortDescription = data.get('shortDescription');
        const longDescription = data.get('longDescription');

        const articleData = {
            topic: topic,
            source: source,
            author: author,
            status: status,
            youtubeLink: youtubeLink,
            condition: condition,
            shortDescription: shortDescription,
            longDescription: longDescription,
            thumbnail: thumbnailPath,
        };

        const user = await db.nmu.create({
            data: articleData,
        });
        return NextResponse.json({ user })
    } catch (error) {
        console.log(error);
    }
};
