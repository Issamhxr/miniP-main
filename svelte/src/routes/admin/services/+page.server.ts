import type { PageServerLoad } from './$types';
import { getServices, getService } from '$lib/server/api';

export const load: PageServerLoad = async () => {
  try {
    const services = await getServices();
    return { services };
  } catch (err) {
    return {
      services: [],
      error: 'Could not load services.'
    }
  }
};

