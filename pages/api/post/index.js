import Post from '@/models/Post';
import db from '@/middleware';

if (req.method === 'POST') {
    try {
        let post = await Post.create({
            image: req.body.image,
        });
        return res.status(200).json({ success: true, post });

    }
    catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
}