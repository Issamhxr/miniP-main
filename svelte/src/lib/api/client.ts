export async function getServiceClient(id: string) {
  const response = await fetch(`/api/service/${id}`);
  if (!response.ok) throw new Error('Failed to fetch service');
  return response.json();
}
