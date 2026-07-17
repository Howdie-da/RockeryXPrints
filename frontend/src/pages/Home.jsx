import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import FandomMarquee from '../components/landing/FandomMarquee'
import FeaturedProducts from '../components/landing/FeaturedProducts'
import BentoAbout from '../components/landing/BentoAbout'
import Footer from '../components/landing/Footer'

function Home() {
  return (
    <div id='home' className='min-h-screen bg-white text-black font-space selection:bg-black selection:text-white overflow-x-hidden antialiased'>
        <Navbar/>
        <main className='pt-20'>
            <Hero />
            <FandomMarquee />
            <FeaturedProducts />
            <BentoAbout />
        </main>
        <Footer />
    </div>
  )
}

export default Home