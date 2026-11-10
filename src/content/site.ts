import { SiteConfig } from "@/types";

export const STORE_LINKS_ENABLED = false;

export const siteConfig: SiteConfig = {
  name: "Jun Designs LTD",
  tagline: "Authentic Cultural Workshops & Artisan Studio",
  address: {
    facility: "Kigali Culture Village (Agaseke Center building)",
    area: "Rebero, Kicukiro",
    street: "Street KK 557 St",
    cityCountry: "Kigali, Rwanda",
    full: "Kigali Culture Village (Agaseke Center building), Rebero, Kicukiro. Street KK 557 St, Kigali",
  },
  phone: "+250 780 324 944",
  phoneRaw: "+250780324944",
  whatsappUrl: "https://wa.me/250780324944?text=Hello%20Jun%20Designs%2C%20I%20would%20like%20to%20inquire%20about%20a%20cultural%20workshop",
  email: "info@jundesigns.rw",
  socials: {
    facebook: "https://www.facebook.com/share/1JMxGSrY32/?mibextid=wwXIfr",
    instagram: "https://www.instagram.com/jun_designs_?rpxt=dzBvZ3FvcTE2enI3&utm_source=qr",
    tiktok: "https://www.tiktok.com/@jun.designs?_r=1&_t=ZS-9BGBLrxptX2",
    googleBusiness: "https://maps.google.com/?q=Jun+Designs+Kigali+Culture+Village+Rebero+Rwanda",
    pinterest: "https://pinterest.com/jundesignsrw",
  },
  externalLinks: {
    shop: "https://jundesigns.rw/shop/",
    customOrders: "https://jundesigns.rw/custom-work/",
  },
  copyright: "© Jun Designs LTD 2026. All rights reserved.",
};

export const navigationLinks = [
  {
    name: "Workshops",
    href: "/workshops",
    children: [
      { name: "Imigongo Painting", href: "/workshops/imigongo-painting", desc: "Traditional geometric relief art with natural pigments" },
      { name: "Traditional Dance", href: "/workshops/traditional-dance", desc: "Intore rhythm, ingoma drumming & royal movement" },
      { name: "Carpet Hand-Weaving", href: "/workshops/hand-weaving", desc: "Sisal fiber spinning & Agaseke basket craftsmanship" },
      { name: "Igisoro Game", href: "/workshops/igisoro-game", desc: "Ancient 16-pit mancala board strategy & rules" },
    ],
  },
  {
    name: "Schools",
    href: "/schools",
    isExternal: false,
  },
  {
    name: "Store",
    href: "https://jundesigns.rw/shop/",
    isExternal: true,
  },
  {
    name: "Custom Orders",
    href: "https://jundesigns.rw/custom-work/",
    isExternal: true,
  },
  {
    name: "Contact",
    href: "/contact",
    isExternal: false,
  },
];

export const footerLinkGroups = [
  {
    title: "Shop & Studio",
    links: [
      { name: "Artisan Shop", href: "https://jundesigns.rw/shop/", isExternal: true },
      { name: "Custom Furniture & Decor", href: "https://jundesigns.rw/custom-work/", isExternal: true },
      { name: "All Cultural Workshops", href: "/workshops", isExternal: false },
      { name: "Schools & Groups", href: "/schools", isExternal: false },
      { name: "Group & Private Bookings", href: "/contact", isExternal: false },
    ],
  },
  {
    title: "Help & Visits",
    links: [
      { name: "Directions & Location", href: "/contact", isExternal: false },
      { name: "Frequently Asked Questions", href: "/faq", isExternal: false },
      { name: "Returns & Rescheduling", href: "/returns-exchanges", isExternal: false },
      { name: "Terms & Conditions", href: "/terms-conditions", isExternal: false },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Jun Designs", href: "/company", isExternal: false },
      { name: "Cultural Journal & Blog", href: "/blog", isExternal: false },
      { name: "Design System / Style Guide", href: "/style-guide", isExternal: false },
      { name: "WhatsApp Concierge", href: "https://wa.me/250780324944", isExternal: true },
    ],
  },
];
