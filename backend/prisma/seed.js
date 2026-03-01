const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  // Read posts from JSON file
  const postsFile = path.join(__dirname, '../data/posts.json');
  const postsData = JSON.parse(fs.readFileSync(postsFile, 'utf-8'));

  console.log(`Seeding database with ${postsData.length} posts...`);

  for (const postData of postsData) {
    const { comments, ...postInput } = postData;

    // Create or update post
    const post = await prisma.post.upsert({
      where: { slug: postData.slug },
      update: postInput,
      create: postInput,
    });

    // Create comments for this post
    if (comments && comments.length > 0) {
      for (const comment of comments) {
        await prisma.comment.upsert({
          where: { id: comment.id },
          update: {
            name: comment.name,
            text: comment.text,
            time: comment.time,
            likes: comment.likes,
          },
          create: {
            id: comment.id,
            name: comment.name,
            text: comment.text,
            time: comment.time,
            likes: comment.likes,
            postId: post.id,
          },
        });
      }
    }

    console.log(`✓ Seeded post: ${post.slug}`);
  }

  console.log('✓ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
