import { createClient } from '@sanity/client';

// export default sanityClient({
//   projectId: import.meta.env.VITE_PROJECT_ID, // find this at manage.sanity.io or in your sanity.json
//   dataset: import.meta.env.VITE_DATASET, // this is from those question during 'sanity init'
//   useCdn: true,
//   apiVersion: "2022-02-03",
// });

const sanityClient = createClient({
  projectId: import.meta.env.VITE_PROJECT_ID, // find this at manage.sanity.io or in your sanity.json
  dataset: import.meta.env.VITE_DATASET, // this is from those question during 'sanity init'
  useCdn: true,
  apiVersion: "2022-02-03",
});

export default sanityClient;
