import { getService } from '$lib/server/api';

export const GET = async ({ params }) => {
  try {
    return new Response(JSON.stringify(await getService(params.id)));
  } catch (err) {
    return new Response(`Error....${err}`, { status: 500 });
  }
};

