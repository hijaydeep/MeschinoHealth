import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';

const db = new PrismaClient();

export const GET = async (req, { params }) => {
    const id = parseInt(params.id);
    try {
        const article = await db.nmu.findUnique({
            where: { id: id },
        });
        if (article) {
            return NextResponse.json({ article, status: 200 });
        } else {
            return NextResponse.json({ error: 'Article not found', status: 404 });
        }
    } catch (error) {
        console.log(error);
    }
}

export const PUT = async (req, { params }) => {
    const id = parseInt(params.id);
    try {
        const data = await req.formData();

        const topic = data.get('topic');
        const source = data.get('source');
        const author = data.get('author');
        const youtubeLink = data.get('youtubeLink');
        const condition = data.get('condition');
        const shortDescription = data.get('shortDescription');
        const longDescription = data.get('longDescription');
        const status = data.get('status');

        const updatedArticle = {
            topic: topic,
            source: source,
            author: author,
            youtubeLink: youtubeLink,
            condition: condition,
            shortDescription: shortDescription,
            longDescription: longDescription,
            status: status,
        };

        const thumbnail = data.get('thumbnail');
        if (thumbnail instanceof File) {
            const bytes = await thumbnail.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const newImagePath = `public/uploads/articles/${thumbnail.name}`;
            await writeFile(newImagePath, buffer);
            updatedArticle.thumbnail = newImagePath;
        }
        else if (typeof thumbnail === 'string' || null) {
            updatedArticle.thumbnail = thumbnail;
        }
        const updateduser = await db.nmu.update({
            where: { id: id },
            data: updatedArticle,
        });
        const result = thumbnail instanceof File ? 201 : 200;
        return NextResponse.json({ updateduser, result });
    } catch (error) {
        console.log(error);
    }
}

export const DELETE = async (req, { params }) => {
    const id = parseInt(params.id);
    try {
        const article = await db.nmu.findUnique({
            where: { id: id },
            select: { thumbnail: true }
        });
        if (article) {
            if (article.thumbnail) {
                await unlink(article.thumbnail);
            }
            await db.nmu.delete({ where: { id: id } });
            return NextResponse.json({ message: 'Article deleted successfully', status: 200 });
        } else {
            return NextResponse.json({ error: 'Article not found', status: 404 });
        }
    } catch (error) {
        console.log(error);
    }
};
