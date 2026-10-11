// Fetches the live Google rating and reviews for Paratha Rasoi through the
// Google Maps JavaScript API (Places library). Needs VITE_GOOGLE_MAPS_API_KEY.
// Google returns up to 5 reviews ("most relevant") per place.

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const PLACE_ID = import.meta.env.VITE_GOOGLE_PLACE_ID || 'ChIJI0A2MrcNrjsRTgmZlLKGnZ4'
const SEARCH_QUERY = 'Paratha Rasoi, LG City, Gunjur - Nerige Road, Gunjur, Bengaluru 560087'
const CACHE_KEY = 'pr-google-reviews'
const CACHE_MS = 6 * 60 * 60 * 1000

export const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/search/?api=1&query=Google&query_place_id=ChIJI0A2MrcNrjsRTgmZlLKGnZ4'

let mapsPromise
function loadMaps() {
  if (window.google?.maps?.importLibrary) return Promise.resolve()
  mapsPromise ??= new Promise((resolve, reject) => {
    window.__prMapsReady = resolve
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(API_KEY)}&v=weekly&loading=async&callback=__prMapsReady`
    script.async = true
    script.onerror = () => reject(new Error('Could not load Google Maps'))
    document.head.appendChild(script)
  })
  return mapsPromise
}

function readCache() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY))
    if (cached && Date.now() - cached.savedAt < CACHE_MS) return cached.data
  } catch {
    // storage unavailable or corrupt: fetch fresh
  }
  return null
}

function writeCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }))
  } catch {
    // storage unavailable: skip caching
  }
}

export async function fetchGoogleReviews() {
  if (!API_KEY) throw new Error('missing-key')
  const cached = readCache()
  if (cached) return cached

  await loadMaps()
  const { Place } = await window.google.maps.importLibrary('places')

  let place
  if (PLACE_ID) {
    place = new Place({ id: PLACE_ID })
  } else {
    const { places } = await Place.searchByText({ textQuery: SEARCH_QUERY, fields: ['id'], maxResultCount: 1 })
    if (!places?.length) throw new Error('Place not found')
    place = places[0]
  }

  await place.fetchFields({ fields: ['displayName', 'rating', 'userRatingCount', 'reviews', 'googleMapsURI'] })

  const data = {
    rating: place.rating ?? null,
    total: place.userRatingCount ?? 0,
    url: place.googleMapsURI || GOOGLE_REVIEWS_URL,
    reviews: (place.reviews || [])
      .filter((review) => review.text)
      .map((review) => ({
        author: review.authorAttribution?.displayName || 'Google user',
        authorUrl: review.authorAttribution?.uri || null,
        photo: review.authorAttribution?.photoURI || null,
        rating: review.rating ?? 5,
        text: review.text,
        when: review.relativePublishTimeDescription || '',
      })),
  }
  writeCache(data)
  return data
}
