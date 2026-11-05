export type { Workshop, WorkshopGalleryItem } from "@/content/workshops";

export interface Testimonial {
  id: string;
  author: string;
  origin: string; // e.g. "Nairobi, Kenya" or "Brussels, Belgium"
  workshopSlug: string;
  workshopName: string;
  quote: string;
  rating: number; // 5
  dateAttended: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  address: {
    facility: string;
    area: string;
    street: string;
    cityCountry: string;
    full: string;
  };
  phone: string;
  phoneRaw: string;
  whatsappUrl: string;
  email: string;
  socials: {
    facebook: string;
    instagram: string;
    pinterest: string;
  };
  externalLinks: {
    shop: string;
    customOrders: string;
  };
  copyright: string;
}
