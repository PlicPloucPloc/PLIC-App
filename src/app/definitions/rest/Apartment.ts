export interface Apartment {
  adLink: string;
  location: string;
  additional_info: AdditionalInfo;
}

export interface AdditionalInfo {
  title: string;
  description: string;
  criteria: Criteria;
  images: Images;
}

export interface Criteria {
  type: string;
  isFurnished: boolean;
  surface: number;
  numberOfRooms: number;
  numberOfBedRoom: number;
  energyClass: string;
  ges: string;
  additionalData: string;
  heating_type: string;
  heatingMode: string;
  floor: number;
  elevator: boolean;
  availableFrom: string;
  monthlyCharges: number;
  securityDeposite: number;
  includeCharges: boolean;
}

export interface Images {
  thumb_url: string;
  small_url: string;
  nb_images: number;
  urls: string[];
  urls_thumb: string[];
  urls_large: string[];
}
