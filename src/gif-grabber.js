export async function getGif (searchTerm) {
  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=1q27TIBNPrOlWWD2Nz8uA1hFvPH1Hgss&s=${searchTerm}`)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const imgData = await response.json()
    const gif = imgData.data.images.original.url
    return gif
  } catch(error) {
    console.error(error.message)
  }
}