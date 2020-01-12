import React, { useState } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import styles from "./LocationSearchInput.module.scss";

type LocationSearchInputProps = {
  currentValue: string | undefined;
  selectLocationHandler(location: string): void;
};

const LocationSearchInput: React.FC<LocationSearchInputProps> = props => {
  const { currentValue, selectLocationHandler } = props;
  const [location, setLocation] = useState<string>(
    currentValue ? currentValue : ""
  );

  const handleChange = (location: string) => {
    setLocation(location);
    selectLocationHandler(location);
  };

  const handleSelect = (location: string) => {
    setLocation(location);
    selectLocationHandler(location);
  };

  return (
    <PlacesAutocomplete
      value={location}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <input
            {...getInputProps({
              placeholder: "Zoek locaties ...",
              className: `location-search-input ${styles["location-search-input"]}`
            })}
          />
          {suggestions.length > 0 && (
            <div
              className={`autocomplete-dropdown-container ${styles["location-search-input__dropdown"]}`}
            >
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default LocationSearchInput;
