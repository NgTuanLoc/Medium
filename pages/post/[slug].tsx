import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity';
import { Post } from '../../typings';

const Post = () => {
	return <div></div>;
};

export default Post;

export const getStaticPaths = async () => {
	const query = `
  *[_type == "post"]{
    _id, 
     slug {
     current
   }
   }`;
	const posts = await sanityClient.fetch(query);
	const paths = posts.map((post: Post) => {
		return {
			params: {
				slug: post.slug.current,
			},
		};
	});
	return {
		paths,
		fallback: 'blocking',
	};
};