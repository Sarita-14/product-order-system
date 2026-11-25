import { useState, useEffect } from "react";

function ProductSearch() {

  const [search, setSearch] = useState(""); //Stores what the user is typing
  const [debouncedSearch, setDebouncedSearch] = useState(""); //Stores the search value after the waiting period

  useEffect(() => {

    const timer = setTimeout(() => {
      setDebouncedSearch(search); //updates the final search value
    }, 500);

    return () => clearTimeout(timer); //cancels the previous timer if the user types again

  }, [search]); //Tells React to run this effect every time search changes

  return (
    <div>

      <h2>Search Products</h2>

      <input
        type="text"
        placeholder="Enter product name"
        value={search}
        onChange={(e) => setSearch(e.target.value)} //Captures every keystroke and saves it immediately into search
      />

      <p>Typing: {search}</p>

      <p>Search executed for: {debouncedSearch}</p>

    </div>
  );
}

export default ProductSearch;