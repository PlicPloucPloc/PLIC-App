import { apiFetch } from './Client';
import Endpoints from './Endpoints';

export async function getApartments(): Promise<Response> {
  return apiFetch(
    Endpoints.APARTMENT.GET_ALL,
    {
      method: 'GET',
    },
    true,
  );
}

export async function getApartmentById(id: number): Promise<Response> {
  return apiFetch(
    Endpoints.APARTMENT.GET_BY_ID(id),
    {
      method: 'GET',
    },
    true,
  );
}
