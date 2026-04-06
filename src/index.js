import './style.css'

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

async function checkWeather (city, unit) {
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

const creator = {
  element (tag) { return document.createElement(tag) }
}
const form = new FormData(document.querySelector('form'))
const submitButton = document.querySelector('.submit')
const tags = [
  'div'
  , 'p'
  , 'img'
  , 'span'
]

tags.forEach((tag) => {
  creator[tag] = function () {
    return this.element(tag)
  }
})

async function displayWeather () {
  // const city = form.get('location')
  // const unit = form.get('unit')
  const city = document.getElementById('location')
  const unit = document.querySelector('input[type="radio"]:checked')
  if (city.value === '') return
  const data = await checkWeather(city.value, unit.value)
  city.value = ''
  console.log(data)
}

submitButton.addEventListener('click', (e) => {
  e.preventDefault()
  displayWeather()
})