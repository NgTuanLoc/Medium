/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import { FaMediumM } from 'react-icons/fa';

import { sanityClient, urlFor } from '../sanity';
import { Post } from '../typings';
import Link from 'next/link';

interface Props {
	posts: [Post];
}

const Home = ({ posts }: Props) => {
	return (
		<div className='lg:px-24'>
			<Head>
				<title>Medium - Where good ideas find you.</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Header />

			<div className='flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-3  mx-auto mb-9'>
				<div className='px-10 space-y-5'>
					<h1 className='text-6xl max-w-xl font-serif'>
						<span
							className='underline decoration-black
				decoration-4'>
							Medium
						</span>{' '}
						is a place to write, read, and connect
					</h1>
					<h2>
						It&lsquo;s easy and free to post your thinking on any topic and
						connect with millions of readers.
					</h2>
				</div>
				<div className='hidden md:inline-flex px-10'>
					<FaMediumM className='text-[7rem] lg:text-[10rem]' />
				</div>
			</div>

			{/* POSTS */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 sm:px-5'>
				{posts.map((post) => {
					return (
						<Link key={post._id} href={`/post/${post.slug.current}`}>
							<div className='group cursor-pointer border rounded-lg overflow-hidden'>
								<img
									className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out'
									src={urlFor(post.mainImage).url()}
									alt={post.title}
								/>
								<div className='flex justify-between items-center p-4 bg-white'>
									<div>
										<p className='text-lg font-bold'>{post.title}</p>
										<p className='text-s'>
											{post.description} by {post.author.name}
										</p>
									</div>
									<img
										className='h-[5rem] w-[5rem] object-cover rounded-full'
										src={urlFor(post.author.image).url()}
										alt={post.author.name}
									/>
								</div>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default Home;

export const getServerSideProps = async () => {
	const query = `
	*[_type == "post"]{
		_id,title,slug,description,mainImage,
		author -> {
		name, image
	  }
	  }
	`;
	const posts = await sanityClient.fetch(query);
	return {
		props: {
			posts,
		},
	};
};
