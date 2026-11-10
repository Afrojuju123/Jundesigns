export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  coverImage: string;
  secondaryImage?: string;
  publishedAt: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    role: string;
  };
  content: string[];
  callout?: string;
  relatedWorkshopSlug?: string;
  relatedWorkshopName?: string;
}

/**
 * Authentic blog posts store for Jun Designs Cultural Journal.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "rwandan-barkcloth-heritage-written-in-nature",
    title: "Rwandan Barkcloth: A Heritage Written in Nature",
    subtitle: "Rediscovering Rwanda’s Traditional Art of Making Cloth",
    excerpt:
      "Long before modern fabrics became common in Rwanda, our ancestors found ways to create clothing from natural resources. Discover the remarkable tradition of barkcloth (Impuzu) produced from the indigenous Umuvumu fig tree.",
    coverImage: "/images/about/founder-fred-outdoors.jpg",
    secondaryImage: "/images/about/founder-fred-students.jpg",
    publishedAt: "May 18, 2024",
    readTime: "4 min read",
    category: "Traditional Crafts & Textiles",
    author: {
      name: "Musemakweri Fred Junior",
      role: "Founder & Creative Director",
    },
    relatedWorkshopSlug: "hand-weaving",
    relatedWorkshopName: "Carpet Hand-Weaving",
    content: [
      "Long before modern fabrics became common in Rwanda, our ancestors found ways to create clothing from the natural resources surrounding them. Among these remarkable traditions was the making of barkcloth, a traditional fabric produced from the bark of the indigenous fig tree known as Umuvumu.",
      "Historically, barkcloth was an important part of traditional Rwandan clothing. The fabric, known as Impuzu, was made by carefully removing bark from the tree and repeatedly beating and pounding it until it became soft, flexible and cloth-like. Skilled hands transformed a natural material into something that could be worn, demonstrating the creativity, resourcefulness and craftsmanship of earlier generations.",
      "Barkcloth was used to make garments for men, women and children. It was part of everyday life and traditional dress, reflecting the relationship between Rwandan communities and their natural environment. Clothing in traditional Rwanda also communicated aspects of identity, age, social position and cultural belonging.",
      "Over time, the introduction and increasing availability of imported cotton fabrics, together with changing lifestyles, gradually reduced the use of barkcloth. By the mid-twentieth century, its role as everyday clothing had significantly diminished. Nevertheless, its place in Rwanda’s history remains an important reminder of the knowledge, creativity and skills of our ancestors.",
      "Today, as interest in traditional craftsmanship and sustainable materials continues to grow, barkcloth offers an opportunity to rediscover an important part of Rwanda’s artistic heritage. Its natural texture, origins and traditional production techniques can inspire contemporary applications in fashion, interior decoration, artistic creations and cultural education.",
      "At Jun Designs, we celebrate barkcloth as part of Rwanda’s creative and cultural history. We believe that traditional knowledge should not simply remain in historical accounts but should continue to inspire new generations. Through art, workshops, research and contemporary design, we aim to reconnect people with traditional craftsmanship and explore how ancestral techniques can contribute to modern creativity.",
      "Barkcloth is more than a traditional fabric. It is a reminder of how our ancestors transformed nature into art, creativity into craftsmanship and everyday resources into cultural heritage.",
      "Jun Designs — Celebrating Heritage Through Art, Creativity and Culture.",
    ],
  },
  {
    slug: "imigongo-the-art-of-rwandan-heritage",
    title: "Imigongo: The Art of Rwandan Heritage",
    subtitle: "A Tradition of Creativity, Geometry and Cultural Identity",
    excerpt:
      "Recognised for its striking geometric relief patterns, mineral pigments, and historic royal roots, Imigongo is one of Rwanda's most distinctive art forms. Discover its 18th-century origin and modern vitality.",
    coverImage: "/images/imigongo-detail-painting.jpg",
    secondaryImage: "/images/imigongo/imigongo-table-concentric.jpg",
    publishedAt: "June 24, 2024",
    readTime: "5 min read",
    category: "Living Heritage & Art",
    author: {
      name: "Musemakweri Fred Junior",
      role: "Founder & Creative Director",
    },
    relatedWorkshopSlug: "imigongo-painting",
    relatedWorkshopName: "Imigongo Painting Workshop",
    content: [
      "Imigongo is one of Rwanda’s distinctive traditional art forms, recognised for its beautiful geometric patterns, raised textures and striking designs. Originating in the eastern part of Rwanda, particularly the historic Kingdom of Gisaka, this remarkable art is believed to date back to the 18th century. According to popular tradition, its creation is associated with Prince Kakira, who used the technique to decorate the interior walls of his father’s residence.",
      "Traditionally, Imigongo was created using a mixture of cow dung and ash, carefully shaped by hand into raised patterns of spirals, diamonds, zigzags and other geometric forms. Once dried, the designs were decorated using natural pigments, with black, white and reddish-brown among the traditional colours. These artistic patterns became an important part of Rwandan domestic decoration and craftsmanship.",
      "For generations, the knowledge and techniques of Imigongo have been passed down through traditional craftsmanship, particularly among women. Despite periods when the practice faced challenges and the loss of cultural knowledge, dedicated artisans and women’s cooperatives helped revive and preserve this remarkable tradition.",
      "Today, Imigongo has evolved beyond traditional wall decoration. Its distinctive patterns and textures inspire contemporary paintings, pottery, furniture, interior decoration, fashion and other creative products. While its techniques and applications continue to evolve, its connection to Rwandan cultural heritage remains an important part of its identity.",
      "At Jun Designs, we celebrate Imigongo as an expression of Rwandan creativity, craftsmanship and cultural identity. Through artistic creations, contemporary interpretations and hands-on workshops, we aim to introduce more people to this remarkable art form, encourage the appreciation of traditional techniques and create opportunities for cultural learning and creative expression.",
      "Our vision is to keep this heritage alive by connecting traditional knowledge with modern creativity, allowing local and international audiences to discover, experience and appreciate the beauty of Rwandan art.",
      "Imigongo is more than a pattern; it is a living expression of heritage, shaped by generations and carried into the future through creativity.",
      "Jun Designs — Celebrating Heritage Through Art, Creativity and Culture.",
    ],
  },
];
