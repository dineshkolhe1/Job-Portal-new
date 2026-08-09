import React, { useContext, useRef } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);

  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
    setIsSearched(true);
  };
  return (
    <div className="container 2xl:px-20 mx-auto my-10">
      <div className="bg-gradient-to-r from-blue-800 to-blue-950 text-white py-16 text-center mx-2 rounded-xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
          Find Work Near You, Anytime!
        </h2>
        <p className="mb-8 max-w-xl mx-auto text-sm font-light px-5">
          Find real work near you that matches your skills and hustle. Whether
          you’re starting fresh or looking for a new rojgaar, WorkWala is here
          to help you grow — apne area mein, apne logon ke saath.
        </p>
        {/* <div className='flex items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto'>
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
        </div> */}

        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-2">
          <div className="flex flex-col md:flex-row items-stretch md:items-center">
            {/* Job Search */}
            <div className="flex items-center flex-1 px-3 py-2">
              <img
                src={assets.search_icon}
                alt=""
                className="w-4 h-4 opacity-60"
              />
              <input
                ref={titleRef}
                type="text"
                placeholder="Job title or keyword"
                spellCheck={false}
                className="w-full ml-2 text-base font-medium text-black bg-transparent placeholder:text-gray-400 outline-none"
              />
            </div>

            {/* Divider */}
            <div className="hidden md:block h-8 w-px bg-gray-200"></div>

            {/* Location */}
            <div className="flex items-center flex-1 px-3 py-2 border-t md:border-t-0 border-gray-100">
              <img
                src={assets.location_icon}
                alt=""
                className="w-4 h-4 opacity-60"
              />
              <input
                ref={locationRef}
                type="text"
                placeholder="City"
                spellCheck={false}
                className="w-full ml-2 text-base font-medium text-black bg-transparent placeholder:text-gray-400 outline-none"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={onSearch}
              className="mt-2 md:mt-0 md:ml-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all duration-200 shadow hover:shadow-md"
            >
              Find Jobs
            </button>
          </div>
        </div>
      </div>

      <div className="border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md flex h-15">
        <div className="flex justify-center gap-10 lg:gap-16 flex-wrap">
          <p className="font-medium">Trusted by</p>
          <img className="h-6 " src={assets.zomato_logo} alt="Zomato" />
          <img className="h-8" src={assets.ola_logo} alt="Ola" />
          <img className="h-6" src={assets.uber_logo} alt="Uber" />
          <img className="h-6 " src={assets.dominos_logo} alt="Dominos" />
          <img className="h-6" src={assets.oyo_logo} alt="OYO" />
          <img className="h-8" src={assets.mcdonalds_logo} alt="McDonalds" />
          <img className="h-8" src={assets.blinkit} alt="Blinkit" />
          <img className="h-10" src={assets.DMart} alt="DMart" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
