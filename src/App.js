import React, { useState } from "react";

// ==========================================
// 1. CONSTANTS FOR CACHING
// ==========================================
// Bumped to v6 since we changed the available food types!
const CACHE_KEY = "restaurant_cache_v6";
const TIME_KEY = "restaurant_cache_time_v6";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// ==========================================
// 2. THE CHILD COMPONENT (The Form)
// ==========================================
const RestaurantFilterForm = ({ onSearch, isLoading }) => {
  const [foodType, setFoodType] = useState("Any");
  const [partySize, setPartySize] = useState(2);
  const [zipCode, setZipCode] = useState("80602");
  const [distance, setDistance] = useState(15);
  const [isOpenNow, setIsOpenNow] = useState(true);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ foodType, partySize, zipCode, distance, isOpenNow });
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    boxSizing: "border-box",
    backgroundColor: "white",
    fontSize: "16px",
  };

  const labelStyle = {
    display: "block",
    color: "#374151",
    fontWeight: "bold",
    marginBottom: "8px",
  };

  return (
    <form
      onSubmit={handleSearch}
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "32px",
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
        border: "1px solid #f3f4f6",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "24px",
          color: "#1f2937",
          marginTop: 0,
        }}
      >
        Find Tonight's Dinner
      </h2>

      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>Zip Code</label>
        <input
          type="text"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          style={inputStyle}
          disabled={isLoading}
          placeholder="e.g., 80602"
          required
        />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>Search Radius (Miles)</label>
        <input
          type="number"
          min="1"
          max="50"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          style={inputStyle}
          disabled={isLoading}
        />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>What are you craving?</label>
        <select
          value={foodType}
          onChange={(e) => setFoodType(e.target.value)}
          style={inputStyle}
          disabled={isLoading}
        >
          <option value="Any">Any Cuisine</option>
          {/* THE COMPLETE GOOGLE PLACES CUISINE LIST */}
          <option value="American">American</option>
          <option value="Bakery">Bakery</option>
          <option value="Bar">Bar / Pub</option>
          <option value="Barbecue">Barbecue</option>
          <option value="Brazilian">Brazilian</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Brunch">Brunch</option>
          <option value="Cafe">Cafe</option>
          <option value="Chinese">Chinese</option>
          <option value="Coffee Shop">Coffee Shop</option>
          <option value="Fast Food">Fast Food</option>
          <option value="French">French</option>
          <option value="Greek">Greek</option>
          <option value="Hamburger">Hamburger</option>
          <option value="Ice Cream Shop">Ice Cream Shop</option>
          <option value="Indian">Indian</option>
          <option value="Indonesian">Indonesian</option>
          <option value="Italian">Italian</option>
          <option value="Japanese">Japanese</option>
          <option value="Korean">Korean</option>
          <option value="Lebanese">Lebanese</option>
          <option value="Mediterranean">Mediterranean</option>
          <option value="Mexican">Mexican</option>
          <option value="Middle Eastern">Middle Eastern</option>
          <option value="Pizza">Pizza</option>
          <option value="Ramen">Ramen</option>
          <option value="Sandwich Shop">Sandwich Shop</option>
          <option value="Seafood">Seafood</option>
          <option value="Spanish">Spanish</option>
          <option value="Steakhouse">Steakhouse</option>
          <option value="Sushi">Sushi</option>
          <option value="Thai">Thai</option>
          <option value="Turkish">Turkish</option>
          <option value="Vegan">Vegan</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vietnamese">Vietnamese</option>
        </select>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>How many people?</label>
        <input
          type="number"
          min="1"
          max="20"
          value={partySize}
          onChange={(e) => setPartySize(Number(e.target.value))}
          style={inputStyle}
          disabled={isLoading}
        />
      </div>

      <div
        style={{
          marginBottom: "32px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <input
          type="checkbox"
          id="openNowCheckbox"
          checked={isOpenNow}
          onChange={(e) => setIsOpenNow(e.target.checked)}
          disabled={isLoading}
          style={{
            width: "20px",
            height: "20px",
            cursor: isLoading ? "not-allowed" : "pointer",
            accentColor: "#2563eb",
          }}
        />
        <label
          htmlFor="openNowCheckbox"
          style={{
            color: "#374151",
            fontWeight: "600",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          Only show places that are open right now
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: "100%",
          backgroundColor: isLoading ? "#9ca3af" : "#2563eb",
          color: "white",
          fontWeight: "bold",
          padding: "16px",
          borderRadius: "8px",
          fontSize: "18px",
          border: "none",
          cursor: isLoading ? "not-allowed" : "pointer",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
        }}
      >
        {isLoading ? "Loading Restaurants..." : "Get Recommendations"}
      </button>
    </form>
  );
};

// ==========================================
// 3. THE PARENT COMPONENT (The App)
// ==========================================
export default function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [currentResults, setCurrentResults] = useState([]);
  const [queue, setQueue] = useState([]);

  const findRestaurants = async (userChoices) => {
    const { foodType, zipCode, distance, isOpenNow } = userChoices;
    setIsLoading(true);

    const safeZip = zipCode.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const specificCacheKey = `${CACHE_KEY}_${foodType.replace(
      /\s+/g,
      ""
    )}_${distance}_${safeZip}_${isOpenNow}`;
    const specificTimeKey = `${TIME_KEY}_${foodType.replace(
      /\s+/g,
      ""
    )}_${distance}_${safeZip}_${isOpenNow}`;

    const cachedData = localStorage.getItem(specificCacheKey);
    const cachedTime = localStorage.getItem(specificTimeKey);
    const now = Date.now();

    if (
      cachedData &&
      cachedTime &&
      now - parseInt(cachedTime, 10) < CACHE_DURATION
    ) {
      console.log(`Loading cached data for ${foodType} near ${zipCode}...`);
      const parsedData = JSON.parse(cachedData);

      setCurrentResults(parsedData);
      setRecommendations(parsedData.slice(0, 3));
      setQueue(parsedData.slice(3));

      setHasSearched(true);
      setIsLoading(false);
      return;
    }

    console.log(`Fetching fresh data from Google...`);
    try {
      const apiUrl = "https://places.googleapis.com/v1/places:searchText";
      const searchQuery =
        foodType === "Any"
          ? `restaurants within ${distance} miles of ${zipCode}`
          : `${foodType} restaurants within ${distance} miles of ${zipCode}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": "your_api_key", // Make sure to re-add your key here!
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.primaryType,places.priceLevel,places.rating,places.userRatingCount,places.websiteUri,places.googleMapsUri",
        },
        body: JSON.stringify({
          textQuery: searchQuery,
          minRating: 4.0,
          openNow: isOpenNow,
        }),
      });

      const data = await response.json();

      if (!data.places || data.places.length === 0) {
        setRecommendations([]);
        setCurrentResults([]);
        setQueue([]);
        setHasSearched(true);
        setIsLoading(false);
        return;
      }

      const formattedRestaurants = data.places.map((place) => {
        const priceMap = {
          PRICE_LEVEL_INEXPENSIVE: "$",
          PRICE_LEVEL_MODERATE: "$$",
          PRICE_LEVEL_EXPENSIVE: "$$$",
          PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
        };

        return {
          id: place.id,
          name: place.displayName?.text || "Unknown Name",
          foodType: place.primaryType
            ? place.primaryType.replace("_restaurant", "").replace("_", " ")
            : "Any",
          price: priceMap[place.priceLevel] || "Price varies",
          rating: place.rating,
          reviewCount: place.userRatingCount || 0,
          website: place.websiteUri || null,
          googleMapsUrl: place.googleMapsUri || null,
        };
      });

      localStorage.setItem(
        specificCacheKey,
        JSON.stringify(formattedRestaurants)
      );
      localStorage.setItem(specificTimeKey, now.toString());

      setCurrentResults(formattedRestaurants);
      setRecommendations(formattedRestaurants.slice(0, 3));
      setQueue(formattedRestaurants.slice(3));

      setHasSearched(true);
    } catch (error) {
      console.error("Failed to fetch restaurants:", error);
      setRecommendations([]);
      setCurrentResults([]);
      setQueue([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShuffle = () => {
    if (queue.length >= 3) {
      setRecommendations(queue.slice(0, 3));
      setQueue(queue.slice(3));
    } else {
      const leftovers = [...queue];
      const needed = 3 - leftovers.length;

      const freshPool = currentResults.filter(
        (restaurant) =>
          !leftovers.some((leftover) => leftover.id === restaurant.id)
      );

      setRecommendations([...leftovers, ...freshPool.slice(0, needed)]);
      setQueue(freshPool.slice(needed));
    }
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <RestaurantFilterForm onSearch={findRestaurants} isLoading={isLoading} />

      {hasSearched && !isLoading && (
        <div style={{ maxWidth: "450px", margin: "40px auto" }}>
          <h3
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#1f2937",
              borderBottom: "2px solid #e5e7eb",
              paddingBottom: "12px",
            }}
          >
            Your Recommendations:
          </h3>

          {recommendations.length === 0 ? (
            <p
              style={{
                color: "#ef4444",
                backgroundColor: "#fee2e2",
                padding: "16px",
                borderRadius: "8px",
                marginTop: "16px",
              }}
            >
              No restaurants match that criteria. Try expanding your search
              radius or turning off the "Open Now" filter!
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginTop: "24px",
              }}
            >
              {recommendations.map((restaurant) => (
                <div
                  key={restaurant.id}
                  style={{
                    padding: "20px",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 12px 0",
                      fontSize: "20px",
                    }}
                  >
                    {restaurant.website ? (
                      <a
                        href={restaurant.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#2563eb", textDecoration: "none" }}
                      >
                        {restaurant.name} ↗
                      </a>
                    ) : (
                      <span style={{ color: "#1f2937" }}>
                        {restaurant.name}
                      </span>
                    )}
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "#f3f4f6",
                        padding: "4px 12px",
                        borderRadius: "999px",
                        fontSize: "14px",
                        color: "#4b5563",
                        fontWeight: "500",
                      }}
                    >
                      {restaurant.foodType} • {restaurant.price}
                    </span>
                    {restaurant.rating && (
                      <span
                        style={{
                          backgroundColor: "#fef08a",
                          padding: "4px 12px",
                          borderRadius: "999px",
                          fontSize: "14px",
                          color: "#854d0e",
                          fontWeight: "bold",
                        }}
                      >
                        ⭐ {restaurant.rating} (
                        {restaurant.reviewCount?.toLocaleString()})
                      </span>
                    )}
                  </div>

                  {restaurant.googleMapsUrl && (
                    <div style={{ marginTop: "16px" }}>
                      <a
                        href={restaurant.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          color: "#059669",
                          fontSize: "15px",
                          fontWeight: "600",
                          textDecoration: "none",
                        }}
                      >
                        📍 Get Directions
                      </a>
                    </div>
                  )}
                </div>
              ))}

              {currentResults.length > 3 && (
                <button
                  onClick={handleShuffle}
                  style={{
                    marginTop: "8px",
                    width: "100%",
                    backgroundColor: "white",
                    color: "#2563eb",
                    fontWeight: "bold",
                    padding: "12px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    border: "2px solid #2563eb",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#eff6ff";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "white";
                  }}
                >
                  🔄 Show Me 3 More
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
