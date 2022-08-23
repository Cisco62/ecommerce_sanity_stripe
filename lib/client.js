import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
    projectId: 'ac7ndf0u',
    dataset: 'production',
    apiVersion: '2022-08-18',
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN
});
//This enables us to use the sanity image
const builder = imageUrlBuilder(client);

//Getting access to the urls where the images are stored using sanity
export const urlFor = (source) => builder.image(source)