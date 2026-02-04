import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const agent = await prisma.agent.upsert({
    where: { email: 'alex@real-estate-agency.com' },
    update: {},
    create: {
      name: 'Alex Phuket',
      email: 'alex@real-estate-agency.com',
    },
  });
  console.log(`Created agent: ${agent.name}`);

  const properties = [
    {
      slug: 'villa-bang-tao',
      price: 45000000,
      lat: 7.98,
      lng: 98.29,
      type: 'VILLA',
      status: 'AVAILABLE',
      images: ['/images/villa_bang_tao.png'],
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
      images: ['/images/condo_patong.png'],
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
      images: ['/images/villa_rawai.png'],
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
    {
      slug: 'villa-kamala-cliff',
      price: 120000000,
      lat: 7.95,
      lng: 98.27,
      type: 'VILLA',
      status: 'AVAILABLE',
      images: ['/images/villa_kamala.png'],
      translations: [
        { lang: 'EN', field: 'title', content: 'Ultra-Luxury Cliff Villa Kamala' },
        { lang: 'EN', field: 'description', content: 'Unmatched sea views and modern design.' },
        { lang: 'RU', field: 'title', content: 'Ультра-роскошная вилла на скале Камала' },
        { lang: 'RU', field: 'description', content: 'Неповторимый вид на море и современный дизайн.' },
        { lang: 'TH', field: 'title', content: 'วิลล่าหรูบนหน้าผากมลา' },
        { lang: 'TH', field: 'description', content: 'วิวทะเลที่ไม่มีใครเทียบได้' },
      ],
    },
    {
      slug: 'apartments-karon-beach',
      price: 15000000,
      lat: 7.83,
      lng: 98.29,
      type: 'CONDO',
      status: 'AVAILABLE',
      images: ['/images/apartments_karon.png'],
      translations: [
        { lang: 'EN', field: 'title', content: 'Modern Apartments Karon Beach' },
        { lang: 'EN', field: 'description', content: 'Walking distance to the white sands.' },
        { lang: 'RU', field: 'title', content: 'Современные апартаменты на Кароне' },
        { lang: 'RU', field: 'description', content: 'В пешей доступности от белоснежного пляжа.' },
        { lang: 'TH', field: 'title', content: 'อพาร์ทเมนท์ทันสมัยหาดกะรน' },
        { lang: 'TH', field: 'description', content: 'เดินไปชายหาดสีขาวได้' },
      ],
    },
    {
      slug: 'villa-chalong-forest',
      price: 35000000,
      lat: 7.82,
      lng: 98.33,
      type: 'VILLA',
      status: 'AVAILABLE',
      images: ['/images/villa_chalong_forest.png'],
      translations: [
        { lang: 'EN', field: 'title', content: 'Secluded Forest Villa Chalong' },
        { lang: 'EN', field: 'description', content: 'Peaceful living surrounded by nature.' },
        { lang: 'RU', field: 'title', content: 'Уединенная лесная вилла в Чалонге' },
        { lang: 'RU', field: 'description', content: 'Спокойная жизнь в окружении природы.' },
        { lang: 'TH', field: 'title', content: 'วิลล่าในป่าฉลอง' },
        { lang: 'TH', field: 'description', content: 'การใช้ชีวิตที่เงียบสงบท่ามกลางธรรมชาติ' },
      ],
    },
  ];

  for (const p of properties) {
    await prisma.property.upsert({
      where: { slug: p.slug },
      update: {
        images: {
          deleteMany: {},
          create: (p as any).images.map((url: string) => ({ url })),
        },
      },
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
        images: {
          create: p.images.map((url: string) => ({ url })),
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
