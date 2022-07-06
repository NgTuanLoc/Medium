/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import Link from 'next/link';

function Header() {
	return (
		<header className='flex justify-between p-5 max-w-7xl mx-auto'>
			<div className='flex items-center space-x-5 justify-around'>
				<Link href='/'>
					<img
						className='w-44 object-conain cursor-pointer'
						src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzVLQT1kTkaEl9pORoRyD3Pgu5LtE6IWnkHiw2FXLUYDOS56B494dH_r4ejDKzsn6cew&usqp=CAU'
						alt='Medium Logo'
					/>
				</Link>
				<div className='hidden md:inline-flex items-center space-x-5'>
					<h3>About</h3>
					<h3>Contact</h3>
					<h3 className='text-white bg-green-600 px-4 py-1 rounded-full'>
						Follow
					</h3>
				</div>
			</div>
			<div className='flex items-center space-x-5 text-green-600'>
				<h3>Sign In </h3>
				<h3 className='border px-4 py-1 rounded-full'>Get Started</h3>
			</div>
		</header>
	);
}

export default Header;
