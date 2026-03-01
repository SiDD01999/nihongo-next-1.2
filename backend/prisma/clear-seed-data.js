const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Slugs of the original seed/dummy posts
const SEED_SLUGS = [
  'mastering-japanese-particles',
  'keigo-formal-japanese',
  'food-vocabulary-travelers',
  'top-10-kanji-must-know',
  'jlpt-n5-study-guide',
  'japanese-culture-etiquette',
];

async function main() {
  console.log('Removing seeded dummy posts...');

  for (const slug of SEED_SLUGS) {
    const post = await prisma.post.findUnique({ where: { slug } });
    if (post) {
      await prisma.comment.deleteMany({ where: { postId: post.id } });
      await prisma.post.delete({ where: { slug } });
      console.log(`✓ Deleted: ${slug}`);
    } else {
      console.log(`- Skipped (not found): ${slug}`);
    }
  }

  console.log('✓ Cleanup complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
