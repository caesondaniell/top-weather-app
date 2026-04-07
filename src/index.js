import './style.css'
import d2d from 'degrees-to-direction'

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
const submitButton = document.querySelector('.submit')
const tags = [
  'div'
  , 'h2'
  , 'img'
  , 'p'
  , 'span'
]

tags.forEach((tag) => {
  creator[tag] = function () {
    return this.element(tag)
  }
})

async function displayWeather () {
  const city = document.getElementById('location')
  const unit = document.getElementById('unit')
  if (city.value === '') return
  const data = await checkWeather(city.value, unit.value)
  console.log(data)

  city.value = ''

  const container = document.querySelector('.weather-info')
  const card = creator.div()
  const title = creator.h2()
  const temp = creator.p()
  const tempSpan = creator.span()
  const description = creator.p()
  const icon = creator.img()
  const extremes = creator.p()
  const hiSpan = creator.span()
  const loSpan = creator.span()
  const wind = creator.p()
  const windSpdSpan = creator.span()
  const windUnitSpan = creator.span()
  const precip = creator.p()

  temp.append(tempSpan, '°')
  extremes.append('H: ', hiSpan, '° | L: ', loSpan, '°')
  wind.append('Wind: ', windSpdSpan, windUnitSpan, ' ', d2d(data.winddir))
  precip.append('Chance of precipitation: ', data.precipprob, '%')
  card.append(title, temp, description, icon, extremes, wind, precip)
  container.textContent = ''
  container.append(card)

  title.textContent = data.location
  tempSpan.textContent = data.temp
  description.textContent = data.conditions
  hiSpan.textContent = data.max
  loSpan.textContent = data.min
  windSpdSpan.textContent = data.windspeed
  windUnitSpan.textContent = unit.value === 'metric' ? 'km/h' : 'mph'
  
  import(`./icons/${data.icon}.svg`).then((res) => icon.src = res.default)
  icon.setAttribute('alt', `a weather icon`)
}

submitButton.addEventListener('click', (e) => {
  e.preventDefault()
  displayWeather()
})