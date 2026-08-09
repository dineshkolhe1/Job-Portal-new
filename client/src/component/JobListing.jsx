import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets, JobCategories, JobLocations } from "../assets/assets.js";
import Jobcard from "./Jobcard";
import Fuse from "fuse.js";

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs } =
    useContext(AppContext);

  const [showFilter, setShowFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);

  const [filterJobs, setFilterJobs] = useState([]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocation((prev) =>
      prev.includes(location)
        ? prev.filter((c) => c !== location)
        : [...prev, location]
    );
  };

const normalize = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const aliases = {
  supermarket: ["dmart", "mart", "store", "shopping"],
  restaurant: ["restaurant", "cafe", "food", "kitchen"],
  delivery: ["delivery", "courier", "parcel", "logistics"],
  office: ["office", "admin", "assistant"],
  driver: ["driver", "cab", "auto", "truck"],
  security: ["guard", "watchman", "security"],
  hotel: ["hotel", "hospitality"],
  technician: ["electrician", "plumber", "mechanic"],
  healthcare: ["hospital", "clinic", "medical"],
};

useEffect(() => {

  const matchesCategory = (job) =>
    selectedCategories.length === 0 ||
    selectedCategories.some(
      c => normalize(c) === normalize(job.category)
    );

  const matchesLocation = (job) =>
    selectedLocation.length === 0 ||
    selectedLocation.some(
      l => normalize(l) === normalize(job.location)
    );

  const searchText = normalize(
    `${searchFilter.title} ${searchFilter.location}`
  );

  let searchedJobs = jobs;

  if (searchText) {

    const expandedQuery = [searchText];

    Object.entries(aliases).forEach(([key, values]) => {
      if (values.some(word => searchText.includes(word))) {
        expandedQuery.push(key);
      }
    });

    const fuse = new Fuse(jobs, {
      keys: [
        "title",
        "category",
        "location",
        "companyId.name",
        "level",
        "description",
      ],
      threshold: 0.3,
      ignoreLocation: true,
      includeScore: true,
    });

    const results = fuse.search(expandedQuery.join(" "));

    searchedJobs =
      results.length > 0
        ? results.map(result => result.item)
        : [];
  }

  const newFilteredJobs = searchedJobs
    .slice()
    .reverse()
    .filter(
      job =>
        matchesCategory(job) &&
        matchesLocation(job)
    );

  setFilterJobs(newFilteredJobs);
  setCurrentPage(1);

}, [
  jobs,
  selectedCategories,
  selectedLocation,
  searchFilter,
]);

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
      {/* Sidebar*/}

      <div className="w-full lg:w-1/4 bg-white px-4">
        {/* search Filter from Hero component */}
        {isSearched &&
          (searchFilter.title !== "" || searchFilter.location !== "") && (
            <>
              <h3 className="font-medium text-lg mb-4">Current Search</h3>
              <div className="mb-4 text-gray-600">
                {searchFilter.title && (
                  <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
                    {searchFilter.title}
                    <img
                      onClick={(e) =>
                        setSearchFilter((prev) => ({ ...prev, title: "" }))
                      }
                      className="cursor-pointer"
                      src={assets.cross_icon}
                      alt=""
                    />
                  </span>
                )}
                {searchFilter.location && (
                  <span className="ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded">
                    {searchFilter.location}
                    <img
                      onClick={(e) =>
                        setSearchFilter((prev) => ({ ...prev, location: "" }))
                      }
                      className="cursor-pointer"
                      src={assets.cross_icon}
                      alt=""
                    />
                  </span>
                )}
              </div>
            </>
          )}

        <button
          onClick={(e) => setShowFilter((prev) => !prev)}
          className="px-6 py-1.5 rounded border border-gray-400 lg:hidden"
        >
          {showFilter ? "Close" : "Filter"}
        </button>

        {/* Category Filter
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4">Search by Categories</h4>
          <ul className="space-y-4 text-gray-600">
            {JobCategories.map((category, index) => (
              <li className="flex gap-3 items-center" key={index}>
                <input
                  className="scale-125"
                  type="checkbox"
                  onChange={() => handleCategoryChange(category)}
                  checked={selectedCategories.includes(category)}
                />
                {category}
              </li>
            ))}
          </ul>
        </div> */}

        {/*Category Filter*/}
<div className={showFilter ? "" : "max-lg:hidden"}>
  <h4 className="font-semibold text-lg py-4">Search by Categories</h4>

  <div className="flex flex-col gap-3">
    {JobCategories.map((category, index) => (
      <button
        key={index}
        onClick={() => handleCategoryChange(category)}
        className={`
          w-full h-12
          px-5
          rounded-xl
          border
          text-[15px]
          font-medium
          text-left
          transition-all
          duration-200
          shadow-sm
          hover:shadow-md
          hover:border-blue-500
          hover:-translate-y-0.5
          ${
            selectedCategories.includes(category)
              ? "bg-blue-600 text-white border-blue-600 shadow-md"
              : "bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600"
          }
        `}
      >
        <span className="mr-2">{JobCategories[category]}</span>
        {category}
      </button>
    ))}
  </div>
</div>

        {/*Location Filter*/}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4 pt-14">Search by Location</h4>
          <div className="flex flex-col gap-3">
    {JobLocations.map((location, index) => (
      <button
        key={index}
        onClick={() => handleLocationChange(location)}
        className={`
          w-full h-12
          px-5
          rounded-xl
          border
          text-[15px]
          font-medium
          text-left
          transition-all
          duration-200
          shadow-sm
          hover:shadow-md
          hover:border-blue-500
          hover:-translate-y-0.5
          ${
            selectedLocation.includes(location)
              ? "bg-blue-600 text-white border-blue-600 shadow-md"
              : "bg-white text-gray-700 border-gray-200"
          }
        `}
      >
        {location}
      </button>
    ))}
  </div>
        </div>
      </div>

      {/* job listing */}
      <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
        <h3 className="font-medium text-3xl py-2" id="job-list">
          New Job Updates
        </h3>
        <p className="mb-8">
          “अपने हुनर, मेहनत और लगन के अनुसार सही काम पाएँ — अपने ही शहर में।”
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filterJobs
            .slice((currentPage - 1) * 9, currentPage * 9)
            .map((job, index) => (
              <Jobcard key={index} job={job} />
            ))}
        </div>
        {/* Pagination */}
        {filterJobs.length > 0 && (
          <div className="flex items-center justify-center space-x-2 mt-10">
            <a href="#job-list">
              <img
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                src={assets.left_arrow_icon}
                alt=""
              />
            </a>
            {Array.from({ length: Math.ceil(filterJobs.length / 9) }).map(
              (_, index) => (
                <a key={index} href="#job-list">
                  <button
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${currentPage === index + 1 ? "bg-blue-100 text-blue-500" : "text-gray-500"}`}
                  >
                    {index + 1}
                  </button>
                </a>
              )
            )}
            <a href="#job-list">
              <img
                onClick={() =>
                  setCurrentPage(
                    Math.min(currentPage + 1, Math.ceil(filterJobs.length / 9))
                  )
                }
                src={assets.right_arrow_icon}
                alt=""
              />
            </a>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobListing;
