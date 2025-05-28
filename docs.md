# svelte

## api calls
### frontend
We use svelte as a proxy every forntend request should go through the svlete server before hitting the backend.
The request go as follows:
`src/lib/api/client.ts`: is responsible for the svelte server calls.
`src/routes/api/`: this folder is a svelte route which calles the funcitons inside the `client.ts` above.
