import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

// Custom hook for city verification and data fetching
export const useCity = (cityName) => {
  const [cityData, setCityData] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCityData = async (name) => {
    if (!name) return;

    setLoading(true);
    setError(null);

    try {
      // Verify city exists
      const cityInfo = await apiService.verifyCity(name);
      setCityData(cityInfo);

      // Get places for the city
      const placesData = await apiService.getPlacesForCity(name);
      setPlaces(placesData.places || []);

    } catch (err) {
      setError(err.message);
      setCityData(null);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCityData(cityName);
  }, [cityName]);

  return {
    cityData,
    places,
    loading,
    error,
    refetch: () => fetchCityData(cityName)
  };
};

// Custom hook for place enrichment data
export const usePlaceEnrichment = (placeId) => {
  const [enrichmentData, setEnrichmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEnrichment = async (id) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiService.getPlaceEnrichment(id);
      setEnrichmentData(data);
    } catch (err) {
      setError(err.message);
      setEnrichmentData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrichment(placeId);
  }, [placeId]);

  return {
    enrichmentData,
    loading,
    error,
    refetch: () => fetchEnrichment(placeId)
  };
};

// Custom hook for knowledge graph stats
export const useGraphStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiService.getGraphStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

// Custom hook for search functionality
export const useSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (searchParams) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiService.searchEntities(searchParams);
      setResults(data.entities || []);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return {
    results,
    loading,
    error,
    search,
    clearResults
  };
};
