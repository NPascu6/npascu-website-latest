
import React, { useState } from "react";

interface SearchBarProps {
    setSerchTerm: (searchTerm: string) => void;
}

const SearchBar = ({ setSerchTerm }: SearchBarProps) => {
    const [search, setSearch] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setSerchTerm(e.target.value);
    };

    return (
        <div className="search-bar">
            <input
                className="p-2 m-1 w-1/4 border-2 border-gray-200  focus:outline-none focus:border-blue-500"
                type="text"
                placeholder="Search"
                value={search}
                onChange={handleSearch}
            />
        </div>
    );
};

export default SearchBar;