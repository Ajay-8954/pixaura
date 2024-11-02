import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "./ui/button";

const SearchUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]); // Change to an array to store multiple users

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://pixaura.onrender.com/api/v1/user/search/${searchTerm}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.users && response.data.users.length > 0) {
        toast.success("Users found");
        setSearchResults(response.data.users); // Expecting an array of user objects
      } else {
        toast.info("No users found");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("An error occurred while searching for users");
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        handleSearch(searchTerm);
      } else {
        setSearchResults([]); // Clear results if the search term is empty
      }
    }, 300); // Delay in milliseconds

    return () => clearTimeout(delayDebounceFn); // Cleanup function
  }, [searchTerm]); // Only run effect when searchTerm changes

  return (
    <div className="flex flex-col items-center  min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
          Search User
        </h2>

        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter username..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <Button
          onClick={handleSearch}
          className="bg-[#610C9F] text-[#FFFFFF] hover:bg-[#940B92] w-full max-w-xs" // Increased width
        >
          Search
        </Button>

        {searchResults.length > 0 ? (
          <div className="mt-6 text-center ">
            {searchResults.map((user) => (
              <div
                key={user._id}
                className="mb-4 flex items-center p-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Displaying Profile Picture */}
                <Link to={`/profile/${user._id}`}>
                  <img
                    src={user.profilePicture}
                    alt={`${user.username}'s profile`}
                    className="w-16 h-16 rounded-full border border-gray-300 mr-3 transition-transform duration-200 transform hover:scale-105"
                  />
                </Link>

                <div className="flex flex-col flex-1">
                  {/* Displaying Username */}
                  <Link to={`/profile/${user._id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200">
                      {user.username}
                    </h3>
                  </Link>

                  {/* Displaying Bio */}
                  <p className="text-gray-600 mt-1 text-sm">
                    {user.bio || "No bio available"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          searchTerm && (
            <p className="text-red-500 text-center mt-6">No users found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default SearchUser;
