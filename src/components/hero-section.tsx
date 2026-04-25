import Image from 'next/image';
import Link from 'next/link';
import { PixelImage } from './ui/pixel-image';
import Particles from './Particles';


export function HeroSection() {
  const posts = [
  {
    id: 1,
    title: "Is 2026 Web Development Still Worth It",
    slug: "is-2026-web-development-still-worth-it-",
    image: "https://mubashir-blog-assets.s3.ap-south-1.amazonaws.com/covers/Gemini_Generated_Image_qbqk0qbqk0qbqk0q.png",
  },
  
  {
    id: 2,
    title: "How to Build Your First REST API with Node.js and TypeScript in 2026",
    slug: "build-rest-api-nodejs-typescript-2026",
    image: "https://mubashir-blog-assets.s3.ap-south-1.amazonaws.com/covers/How+to+Build+Your+First+REST+API+with+Node.js+and+TypeScript+in+2026.webp",
  },
  {
    id: 3,
    title: "Why TypeScript Is No Longer Optional in 2026",
    slug: "why-typescript-is-no-longer-optional-in-2026",
    image: "https://mubashir-blog-assets.s3.ap-south-1.amazonaws.com/covers/why-typescript-is-no-longer-optional-in-2026.webp",
  },
  
];
  return (
    <>
      <div className="overflow-hidden relative">
    <div style={{ width: '100%', height: '600px', position: 'absolute' }} className='z-0'>
  <Particles
 particleColors={["#408A71"]}
     particleCount={200}
    particleSpread={10}
    speed={0.1}
    particleBaseSize={100}
    moveParticlesOnHover
    alphaParticles={false}
    disableRotation={false}
    pixelRatio={1}
/>
</div>
 
        <section className="pt-12 bg-gradient-to-b from-gray-50 via-white to-gray-50">
          <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid max-w-md grid-cols-1 mx-auto lg:grid-cols-12 gap-x-6 gap-y-8 lg:max-w-none">
              
              {/* Main Content - Semantic HTML for SEO */}
              <div className="self-center lg:col-span-4 z-20">
                <h1 className="text-3xl font-bold text-(--bg-color) sm:text-4xl xl:text-5xl">
                  Hey 👋 I am <span className="text-(--secondary-color)">Mubashir Taj</span>, Developer.
                </h1>
                <p className="mt-5 text-base font-normal leading-7 text-gray-500">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vehicula massa in enim luctus.
                </p>
                <div className="disable-smooth-cursor  relative inline-flex mt-9 group">
                  <div className="disable-smooth-cursor absolute transitiona-all duration-1000 opacity-70 inset-0 bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"></div>
                  <Link
                    href="/blogs"
                    title="Read exclusive NFT blog posts"
                    className="disable-smooth-cursor relative inline-flex items-center justify-center px-8 py-3 sm:text-sm sm:py-3.5 text-base font-semibold text-white transition-all duration-200 bg-(--primary-color) border border-transparent rounded-lg hover:bg-(--primary-hover) focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--primary-color)"
                    aria-label="Read exclusive NFT blog content"  
                  >
                    Read Exclusive Blog
                  </Link>
                </div>
              </div>

              {/* Latest Picks Section */}
              <div className="self-end lg:order-last lg:pb-20 lg:col-span-3">
                <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                  ⚡️ Latest Picks
                </p>

                <div className="mt-6 space-y-6 lg:space-y-8">
                 {posts.map((post) => (
  <article key={post.id} className="relative overflow-hidden">
    <div className="flex items-start disable-smooth-cursor lg:items-center">
      
      <Image
        className="object-cover w-12 h-12 rounded-lg shrink-0"
        src={post.image}
        alt={post.title}
        width={48}
        height={48}
        loading="lazy"
      />

      <p className="ml-5 text-base font-bold leading-6 text-text">
        <Link 
          href={`/blog/${post.slug}`}
          title={post.title}
          className="hover:text-primary transition-colors"
        >
          {post.title}
          <span className="absolute inset-0" aria-hidden="true"></span>
        </Link>
      </p>

    </div>
  </article>
))}
                </div>
              </div>

              {/* Author Image */}
              <div className="self-end lg:col-span-5">
                <PixelImage
                //   className="w-full mx-auto"
                  src="/author.png"
                  alt="Brian Jones - NFT writer and blockchain expert"
                //   width={500}
                //   height={500}
                //   priority
                grid="8x8" 
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}