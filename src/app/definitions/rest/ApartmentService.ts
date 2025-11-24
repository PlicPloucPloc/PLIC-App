export type ApartmentInfo = {
  apartment_id: number;
  owner_id: string;
  name: string;
  location: string;
  is_furnished: boolean;
  surface: number;
  energy_class: string | null;
  available_from: Date | null;
  rent: number;
  type: string;
  ges: string | null;
  description: string;
  number_of_rooms: number | null;
  floor: number | null;
  parking_spaces: number | null;
  number_of_bedrooms: number | null;
  has_elevator: boolean;
  number_of_bathrooms: number | null;
  heating_type: string | null;
  heating_mode: string | null;
  construction_year: number | null;
  number_of_floors: number | null;
  orientation: string | null;
  estimated_price: number | null;

  // Additional fields
  image_thumbnail: string;
  images: string[];
};
