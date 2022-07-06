import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen py-2'>
			<h1>This is My Medium Page</h1>
		</div>
	);
};

export default Home;
