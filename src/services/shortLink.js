const shortLinks = async (destination) => {
  const endpoint = 'https://api.rebrandly.com/v1/links'
  const headers = {
    'Content-Type': 'application/json',
    apikey: '5973a12adf6c4cb982139fb712d60a42',
  }
  const data = {
    destination,
    domain: { fullName: 'rebrand.ly' },
  }
  try {
    const response = await fetch(endpoint, {
      headers,
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw 'fetch error'
    }
    const res = await response.json()
    return `https://${res.shortUrl}`
  } catch (error) {
    return { message: error }
  }
}

export default shortLinks
