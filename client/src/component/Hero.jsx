import React, { useContext, useRef } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Hero = () => {

  const {setSearchFilter, setIsSearched} = useContext(AppContext)

  const titleRef = useRef(null)
  const locationRef = useRef(null)

  const onSearch = () =>{
    setSearchFilter({
      title:titleRef.current.value,
      location:locationRef.current.value
    })
    setIsSearched(true)
    
  }
  return (
    <div className='container 2xl:px-20 mx-auto my-10'>
      <div className='bg-gradient-to-r from-blue-800 to-blue-950 text-white py-16 text-center mx-2 rounded-xl'>
        <h2 className='text-2xl md:text-3xl lg:text-4xl font-medium mb-4'>Find Work Near You, Anytime!</h2>
        <p className='mb-8 max-w-xl mx-auto text-sm font-light px-5'>Find real work near you that matches your skills and hustle. Whether you’re starting fresh or looking for a new rojgaar, WorkWala is here to help you grow — apne area mein, apne logon ke saath.</p>
        <div className='flex items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto'>
            <div className='flex items-center'>
                <img className='h-4 sm:h-5' src={assets.search_icon} alt="" />
                <input type='text'
                placeholder='Search for jobs'
                className='max-sm:*:text-xs p-2 rounded outline-none w-full'
                ref={titleRef}
                />
            </div>
            <div className='flex items-center'>
                <img className='h-4 sm:h-5' src={assets.location_icon} alt="" />
                <input type='text'
                placeholder='location'
                className='max-sm:*:text-xs p-2 rounded outline-none w-full'
                ref={locationRef}
                />
            </div>
            <button onClick={onSearch} className='bg-blue-600 py-2 px-6 rounded text-white m-1'>Search</button>
        </div>
      </div>

      <div className='border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md flex h-15'>
        <div className='flex justify-center gap-10 lg:gap-16 flex-wrap'>
          <p className='font-medium'>Trusted by</p>
          <img className='h-6 ' src={assets.zomato_logo} alt="" />
          <img className='h-8' src={assets.ola_logo} alt="" />
          <img className='h-6' src={assets.uber_Logo} alt="" />
          <img className='h-6 ' src={assets.dominos_logo} alt="" />
          <img className='h-6' src={assets.oyo_logo} alt="" />
          <img className='h-8' src={assets.mcDonalds_logo} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Hero
