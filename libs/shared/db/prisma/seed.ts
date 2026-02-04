import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Create Agent
  const agent = await prisma.agent.upsert({
    where: { email: 'alex@phuket-estate.com' },
    update: {},
    create: {
      name: 'Alex Phuket',
      email: 'alex@phuket-estate.com',
    },
  });
  console.log(`Created agent: ${agent.name}`);

  // Properties Data
  const properties = [
    {
      slug: 'villa-bang-tao',
      price: 45000000,
      lat: 7.98,
      lng: 98.29,
      type: 'VILLA',
      status: 'AVAILABLE',
      translations: [
        { lang: 'EN', field: 'title', content: 'Luxury Villa in Bang Tao' },
        {
          lang: 'EN',
          field: 'description',
          content: 'A beautiful villa near the beach.',
        },
        { lang: 'RU', field: 'title', content: 'Роскошная вилла в Банг Тао' },
        {
          lang: 'RU',
          field: 'description',
          content: 'Прекрасная вилла рядом с пляжем.',
        },
        { lang: 'TH', field: 'title', content: 'วิลล่าหรูในบางเทา' },
        { lang: 'TH', field: 'description', content: 'วิลล่าสวยใกล้ชายหาด' },
      ],
    },
    {
      slug: 'condo-patong',
      price: 8000000,
      lat: 7.89,
      lng: 98.29,
      type: 'CONDO',
      status: 'AVAILABLE',
      translations: [
        { lang: 'EN', field: 'title', content: 'Modern Condo in Patong' },
        {
          lang: 'EN',
          field: 'description',
          content: 'Heart of the nightlife.',
        },
        { lang: 'RU', field: 'title', content: 'Современное кондо в Патонге' },
        { lang: 'RU', field: 'description', content: 'В центре ночной жизни.' },
        { lang: 'TH', field: 'title', content: 'คอนโดทันสมัยในป่าตอง' },
        {
          lang: 'TH',
          field: 'description',
          content: 'ใจกลางสถานบันเทิงยามค่ำคืน',
        },
      ],
    },
    {
      slug: 'villa-rawai',
      price: 65000000,
      lat: 7.77,
      lng: 98.32,
      type: 'VILLA',
      status: 'SOLD',
      translations: [
        { lang: 'EN', field: 'title', content: 'Exclusive Villa in Rawai' },
        {
          lang: 'EN',
          field: 'description',
          content: 'Private pool and sea view.',
        },
        { lang: 'RU', field: 'title', content: 'Эксклюзивная вилла в Раваи' },
        {
          lang: 'RU',
          field: 'description',
          content: 'Частный бассейн и вид на море.',
        },
        { lang: 'TH', field: 'title', content: 'วิลล่าหรูในราวย์' },
        {
          lang: 'TH',
          field: 'description',
          content: 'สระว่ายน้ำส่วนตัวและวิวทะเล',
        },
      ],
    },
  ];

  for (const p of properties) {
    await prisma.property.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        price: p.price,
        lat: p.lat,
        lng: p.lng,
        type: p.type,
        status: p.status,
        agentId: agent.id,
        translations: {
          create: p.translations.map((t) => ({
            entityType: 'Property',
            lang: t.lang,
            field: t.field,
            content: t.content,
          })),
        },
      },
    });
    console.log(`Created property: ${p.slug}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
