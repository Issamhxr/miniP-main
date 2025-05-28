import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090/');

export async function getServices() {
  try {
    const services = await pb.collection('services').getFullList({
      expand: 'components',
      sort: '-updated',
    })
    return services;
  } catch (err) {
    console.error('Error fetching services', err);
    throw Error('Failed to fetch services');
  }
}

export async function getService(serviceId: string) {
  try {
    const service = await pb.collection('services').getOne(serviceId, {
      expand: 'components',
    })
    return service;
  } catch (err) {
    console.error(`Error fetching service with id ${serviceId}:`, err);
    throw Error('Failed to fetch service');
  }
}
