import Post from "@/models/Post";
import db from "@/middleware";

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { image } = req.body;
    
    // if (!image) {
    //   return res.status(400).json({ success: false, message: 'No image provided' });
    // }
    
    const post = new Post({
      image,
      slugPostLink: Date.now().toString() + Math.floor(Math.random() * 10000).toString(),
    });

    try {
      await post.save();
      return res.status(200).json({ success: true, post });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error saving post', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
