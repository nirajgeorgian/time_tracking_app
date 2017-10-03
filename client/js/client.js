window.client = (function() {
  // imediately invoked function will be available globally
  function getTimers(success) {
    return fetch('/api/timers', {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(success)
  }

  function createTimer(data) {
    return fetch('/api/timers', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(checkStatus)
  }

  function updateTimer(data) {
    return fetch('/api/timers', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then(checkStatus)
  }

  function deleteTimer(data) {
    return fetch('/api/timers', {
      method: 'delete',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(checkStatus)
  }

  function startTimer(data) {
    return fetch('/api/timers/start', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(checkStatus)
  }

  function stopTimer(data) {
    return fetch('/api/timers/stop', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
  }

  function checkStatus(response) {
    if(response.status >= 200 && response.status <= 300) {
      return response
    } else {
      const error = new Error(`HTTP error: ${response.statusText}`)
      error.status = response.statusText
      error.response = response
      console.log(error)
      throw error
    }
  }

  function parseJSON(response) {
    return response.json()
  }

  return {
    getTimers,
    createTimer,
    updateTimer,
    startTimer,
    stopTimer,
    deleteTimer,
    checkStatus,
    parseJSON
  }
}())
