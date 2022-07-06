/* eslint-disable @next/next/no-img-element */
import { GetStaticProps } from 'next';
import PortableText from 'react-portable-text';
import { sanityClient, urlFor } from '../../sanity';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';

import Header from '../../components/Header';
import { Post } from '../../typings';

interface IformInput {
	_id: string;
	name: string;
	email: string;
	comment: string;
}

interface Props {
	post: Post;
}

const Post = ({ post }: Props) => {
	const [submitted, setSubmitted] = useState<boolean>(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IformInput>();

	const onSubmit: SubmitHandler<IformInput> = async (data) => {
		try {
			await axios.post('/api/createComment', { data: JSON.stringify(data) });
			setSubmitted(true);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<Header />

			<img
				className='w-full h-40 object-cover'
				src={urlFor(post.mainImage).url()}
				alt={post.title}
			/>

			<article className='max-w-3xl mx-auto'>
				<h1 className='text-3xl mt-10 mb-4'>{post.title}</h1>
				<h2 className='text-xl font-light text-gray-500 mb-2'>
					{post.description}
				</h2>
				<div className='flex space-x-2 items-center'>
					<img
						className='h-14 w-14 rounded-full object-cover'
						src={urlFor(post.author.image).url()}
						alt={post.author.name}
					/>
					<p className='font-extralight text-sm'>
						Blog post by {post.author.name} - Published at{' '}
						{new Date(post._createdAt).toLocaleString()}
					</p>
				</div>

				<div className='mt-10'>
					<PortableText
						dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
						projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT}
						content={post.body}
						serializers={{
							h1: (props: any) => {
								return <h1 className='text-2xl font-bold my-5' {...props} />;
							},
							h2: (props: any) => {
								return <h2 className='text-xl font-bold my-5' {...props} />;
							},
							li: ({ children }: any) => {
								return <li className='ml-4 list-disc'>{children}</li>;
							},
							link: ({ href, children }: any) => {
								return (
									<a href={href} className='text-blue-500 hover:underline'>
										{children}
									</a>
								);
							},
						}}
					/>
				</div>
			</article>

			<hr className='max-w-lg my-5 border border-yellow-500 mx-auto' />

			{submitted ? (
				<div className='flex justify-center text-center flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto'>
					<h3 className='text-3xl font-bold'>Thank your for your comment !</h3>
					<p>Once it has been approved, it will appear below</p>
				</div>
			) : (
				<form
					className='flex flex-col p-5 max-w-xl mx-auto mb-10'
					onSubmit={handleSubmit(onSubmit)}>
					<h3 className='text-sm text-yellow-500'>Enjoyed this article ?</h3>
					<h2 className='text-3xl font-bold'>Leave a comment bellow !</h2>

					<hr className='py-3 mt3' />
					<input
						{...register('_id')}
						type='hidden'
						name='_id'
						value={post._id}
					/>

					<label className='block mb-5'>
						<span className='text-gray-700'>Name</span>
						<input
							{...register('name', { required: true })}
							className='shadow border rounded py-2 px-3 form-input mt-1 block w-full outline-none ring-yellow-500 focus:ring'
							type='text'
							name='name'
							placeholder='Please enter your name'
						/>
					</label>
					<label className='block mb-5'>
						<span className='text-gray-700'>Email</span>
						<input
							{...register('email', { required: true })}
							className='shadow border rounded py-2 px-3 form-input mt-1 block w-full outline-none ring-yellow-500 focus:ring'
							type='email'
							name='email'
							placeholder='Please enter your email'
						/>
					</label>
					<label className='block mb-5'>
						<span className='text-gray-700'>Comment</span>
						<textarea
							{...register('comment', { required: true })}
							className='shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring'
							name='comment'
							rows={10}
							placeholder='Writting comments ...'
						/>
					</label>

					{/* Form Faild */}
					<div className='flex flex-col p-5'>
						{errors.name && (
							<span className='text-red-500'>Please provide name</span>
						)}
						{errors.name && (
							<span className='text-red-500'>Please provide email</span>
						)}
						{errors.name && (
							<span className='text-red-500'>Please provide comment</span>
						)}
					</div>
					<input
						type='submit'
						className='shadow bg-yellow-500 hover:bg-yellow-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer transition duration-200 ease-in-out'
					/>
				</form>
			)}

			{/* Comments */}
			<div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-400 shadow space-y-2'>
				<h3 className='text-4xl'>Comments</h3>
				<hr className='pb-4' />
				{post.comments.map((comment) => {
					return (
						<div key={comment._id}>
							<p>
								<span className='text-yellow-500'>
									{comment.name}: <span>{comment.comment}</span>
								</span>
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const query = `
	*[_type == "post"&& slug.current == "my-second-post"][0]{
		_id,
    title,
    slug,
    description,
    mainImage,
    _createdAt,
    body,
		author -> {
		name, 
    image
	}, 
    "comments": *[
    _type == "comment" &&
    post._ref == ^._id &&
    approved == true
    ]
}
  `;
	const post = await sanityClient.fetch(query, {
		slug: params?.slug,
	});

	if (!post) {
		return {
			notFound: true,
		};
	}
	return {
		props: {
			post,
		},
		revalidate: 60,
	};
};
