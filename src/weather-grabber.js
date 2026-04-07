async function getInfo (city, unit) {
  try {
    const raw = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unit}&iconSet=icons2&key=UCRLKHMNXE8RGJB3Q5XPAW3AK&contentType=json`
    )
    const info = await raw.json()
    return info
  } catch (error) {
    console.log(error)
  }
}

export async function checkWeather (city, unit) {
  const {
    currentConditions: current
    , days
    , resolvedAddress: location
  } = await getInfo(city, unit)
  const {
    conditions
    , feelslike
    , icon
    , precipprob
    , temp
    , winddir
    , windgust
    , windspeed
  } = current
  const { tempmax: max, tempmin: min } = days[0]
  return {
    location
    , conditions
    , feelslike
    , icon
    , precipprob
    , temp
    , max
    , min
    , winddir
    , windgust
    , windspeed
  }
}