import type { PageLoad } from './$types';

// export const load: PageLoad = ({ params }) => {
//   console.log("LoadingData...")
//   return {
//     post: {
//       title: `Title for ${params.slug} goes here`,
//       content: `Content for ${params.slug} goes here`
//     }
//   };
// };


// import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  // Simulate fetching data from a server
  const items = [
    { id: 1, name: 'Svelte' },
    { id: 2, name: 'Kit' },
    { id: 3, name: 'Is Awesome' }
  ];

  return {
    items
  };
};
