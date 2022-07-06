// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import sanityClient from '@sanity/client';

const config = {
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT,
	useCdn: process.env.NODE_ENV === 'production',
	token: process.env.SANITY_API_TOKEN,
};

const client = sanityClient(config);

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { _id, name, email, comment } = JSON.parse(req.body.data);

	try {
		await client.create({
			_type: 'comment',
			post: {
				_type: 'reference',
				_ref: _id,
			},
			name,
			email,
			comment,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Submit comment failed', error });
	}
	res.status(201).json({ message: 'Comment submited' });
}
