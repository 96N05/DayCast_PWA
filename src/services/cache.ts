/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ForecastData, LocationData } from '../types/weather';

const STORAGE_KEY_PREFIX = 'daycast_forecast_';
const ACTIVE_LOCATION_KEY = 'daycast_active_location';
const SAVED_PLACES_KEY = 'daycast_saved_places';
const API_KEY_STORAGE = 'accuweather_api_key';
const UNIT_STORAGE = 'daycast_temp_unit';
const SENSITIVITY_FOCUS_KEY = 'daycast_sensitivity_focus';

export const ONE_HOUR_MS = 60 * 60 * 1000;

export function getSavedPlaces(): LocationData[] {
  try {
    const raw = localStorage.getItem(SAVED_PLACES_KEY) || localStorage.getItem('accuair_saved_places');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePlaceToFavorites(location: LocationData): LocationData[] {
  try {
    const current = getSavedPlaces();
    const exists = current.some((item) => item.key === location.key);
    let updated: LocationData[];
    if (exists) {
      updated = current;
    } else {
      updated = [...current, location];
    }
    localStorage.setItem(SAVED_PLACES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function removePlaceFromFavorites(key: string): LocationData[] {
  try {
    const current = getSavedPlaces();
    const updated = current.filter((item) => item.key !== key);
    localStorage.setItem(SAVED_PLACES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function isPlaceFavorited(key: string): boolean {
  try {
    const current = getSavedPlaces();
    return current.some((item) => item.key === key);
  } catch {
    return false;
  }
}

export function getStoredSensitivityFocus(): string[] {
  try {
    const raw = localStorage.getItem(SENSITIVITY_FOCUS_KEY) || localStorage.getItem('accuair_sensitivity_focus');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredSensitivityFocus(focus: string[]): void {
  try {
    localStorage.setItem(SENSITIVITY_FOCUS_KEY, JSON.stringify(focus));
  } catch (error) {
    console.warn('Failed to save sensitivity focus:', error);
  }
}

export function saveForecastToCache(locationKey: string, data: ForecastData): void {
  try {
    const payload = {
      data,
      cachedAt: Date.now(),
      locationKey,
    };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${locationKey}`, JSON.stringify(payload));
  } catch (error) {
    console.warn('Failed to cache forecast to localStorage:', error);
  }
}

export function getCachedForecast(locationKey: string): { data: ForecastData; cachedAt: number } | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${locationKey}`) || localStorage.getItem(`accuair_forecast_${locationKey}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.data) return null;
    return {
      data: {
        ...parsed.data,
        source: 'cache',
      },
      cachedAt: parsed.cachedAt || Date.now(),
    };
  } catch (error) {
    console.warn('Failed to retrieve forecast from localStorage:', error);
    return null;
  }
}

export function getStoredLocation(): LocationData | null {
  try {
    const raw = localStorage.getItem(ACTIVE_LOCATION_KEY) || localStorage.getItem('accuair_active_location');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredLocation(location: LocationData): void {
  try {
    localStorage.setItem(ACTIVE_LOCATION_KEY, JSON.stringify(location));
  } catch (error) {
    console.warn('Failed to save active location:', error);
  }
}

export function getStoredAccuWeatherApiKey(): string {
  try {
    return localStorage.getItem(API_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function saveStoredAccuWeatherApiKey(key: string): void {
  try {
    localStorage.setItem(API_KEY_STORAGE, key.trim());
  } catch (error) {
    console.warn('Failed to save API key:', error);
  }
}

export function getStoredUnit(): 'C' | 'F' {
  try {
    const unit = localStorage.getItem(UNIT_STORAGE) || localStorage.getItem('accuair_temp_unit');
    return unit === 'F' ? 'F' : 'C';
  } catch {
    return 'C';
  }
}

export function saveStoredUnit(unit: 'C' | 'F'): void {
  try {
    localStorage.setItem(UNIT_STORAGE, unit);
  } catch (error) {
    console.warn('Failed to save temp unit:', error);
  }
}
