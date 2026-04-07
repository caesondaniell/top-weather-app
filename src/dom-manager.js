import d2d from 'degrees-to-direction'
import { getGif } from './gif-grabber.js'
import { checkWeather } from './weather-grabber.js'

const city = document.getElementById('location')
const creator = {
  element (tag) {
    return document.createElement(tag)
  }
}
const tags = ['div', 'h2', 'img', 'p', 'span']
const unit = document.getElementById('unit')
const update = document.querySelector('.submit')

tags.forEach((tag) => {
  creator[tag] = function () {
    return this.element(tag)
  }
})

async function displayWeather () {
  if (city.value === '') return

  const card = creator.div()
  const container = document.querySelector('.weather-info')
  const data = await checkWeather(city.value, unit.value)
  const description = creator.p()
  const extremes = creator.p()
  const gif = await getGif(`weather ${data.icon}`)
  const hiSpan = creator.span()
  const icon = creator.img()
  const loSpan = creator.span()
  const precip = creator.p()
  const temp = creator.p()
  const tempSpan = creator.span()
  const title = creator.h2()
  const wind = creator.p()
  const windSpdSpan = creator.span()
  const windUnitSpan = creator.span()
//remember to remove this
  console.log(data)
  city.value = ''
  container.textContent = ''
  container.style.background = `url(${gif})`
  description.textContent = data.conditions
  hiSpan.textContent = data.max
  loSpan.textContent = data.min
  tempSpan.textContent = data.temp
  tempSpan.dataset.units = unit.value
  title.textContent = data.location
  windSpdSpan.textContent = data.windspeed
  windUnitSpan.textContent = unit.value === 'metric' ? 'km/h' : 'mph'
  
  import(`./icons/${data.icon}.svg`).then((res) => icon.src = res.default)
  icon.alt = `weather icon`
  
  card.classList.add('data-card')
  description.classList.add('conditions')
  extremes.classList.add('extremes')
  hiSpan.classList.add('max')
  icon.classList.add('icon')
  loSpan.classList.add('min')
  precip.classList.add('precip')
  temp.classList.add('temp')
  tempSpan.classList.add('current')
  wind.classList.add('wind')
  windSpdSpan.classList.add('wind-speed')
  windUnitSpan.classList.add('wind-units')

  temp.append(tempSpan, '°')
  extremes.append('H: ', hiSpan, '° | L: ', loSpan, '°')
  wind.append('Wind: ', windSpdSpan, windUnitSpan, ' ', d2d(data.winddir))
  precip.append('Chance of precipitation: ', data.precipprob, '%')
  card.append(title, temp, description, icon, extremes, wind, precip)
  container.append(card)
}

function changeUnits () {
  const oldUnits = document.querySelector('.current').dataset.units
  const newUnits = document.getElementById('unit').value
  switch (newUnits) {
    case ('us'):
      convertTemp('f')
      if (oldUnits === 'metric') convertSpeed()
      break
    case ('metric'):
      convertSpeed('k')
      if (oldUnits === 'us') convertTemp()
      break
    case ('uk'):
      if (oldUnits === 'us') convertTemp()
      if (oldUnits === 'metric') convertSpeed()
      break
  }
  document.querySelector('.current').dataset.units = newUnits
}

function convertSpeed (newUnits) {
  const speed = document.querySelector('.wind-speed')
  const units = document.querySelector('.wind-units')
  if (newUnits === 'k') {
    speed.textContent = Math.round(Number(speed.textContent) * 1.6)
    units.textContent = 'km/h'
  } else {
    speed.textContent = Math.round(Number(speed.textContent) / 1.6)
    units.textContent = 'mph'
  }
}

function convertTemp (newUnits) {
  const nodes = [
    document.querySelector('.current')
    , document.querySelector('.max')
    , document.querySelector('.min')
  ]
  const oldTemps = nodes.map((node) => Number(node.textContent))
  let newTemps
  if (newUnits === 'f') {
    newTemps = oldTemps.map((temp) => {
      return Math.round((temp * (9/5) + 32) * 10) / 10
    })
  } else {
    newTemps = oldTemps.map((temp) => {
      return Math.round(((temp - 32) * (5/9)) * 10) / 10
    })
  }
  newTemps.forEach((temp, i) => nodes[i].textContent = temp)
}

export function addListeners () {
  unit.addEventListener('change', () => {
    if (city.value !== '' || !document.querySelector('.current')) return
    changeUnits()
  })
  update.addEventListener('click', (e) => {
    e.preventDefault()
    displayWeather()
  })
}