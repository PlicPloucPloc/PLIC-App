export type ApartmentInfo = {
  apartment_id: number;
  name: string;
  location: string;
  is_furnished: boolean;
  surface: number;
  energy_class: string;
  available_from: string;
  rent: number;
  type: string;
  ges: string;
  description: string;
  number_of_rooms: number;
  number_of_bed_rooms: number;
  floor: number;
  elevator: boolean;
  parking_spaces: number;

  // Additional fields
  image_thumbnail: string;
  images: string[];
};
