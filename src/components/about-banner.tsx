import Image from 'next/image'
import React from 'react'

const AboutBanner = () => {
    return (
        <div className='w-full p-11 flex flex-col md:flex-row gap-10 items-center justify-center'>
            <div className='md:w-[50%] md:pl-15 pl-2'>
                <h1 className='text-4xl'>Building a Scalable Web Solution with Typescript , Expert Nest & React</h1>
                <p className='py-3'>I'm Full Stack Developer creating high-performance web applications with modern technologies.</p>
               <div className='flex flex-row gap-2'>

                <button className='bg-[var(--bg-color)] text-white px-4 py-2 rounded'>Explore project</button>
                <button className='border border-[var(--bg-color)] text-[var(--bg-color)] px-4 py-2 rounded'>Read The Blog</button>

               </div>
                </div>
            <div className='md:w-[50%] '> 
<Image src={'/about-hero.png'} alt='About Hero Image'  width={500} height={500} />

            </div>
        </div>
    )
}

export default AboutBanner