import API from 'helpers/api'

export const GET_SEARCH = (suggestions) => {
  return {
    type: 'GET_SEARCH',
    suggestions
  }
}

export const CLEAR_SEARCH = (suggestions) => {
  return {
    type: 'CLEAR_SEARCH',
    suggestions
  }
}

export const START_LOADING = (loading) => {
  return {
    type: 'START_LOADING',
    loading
  }
}

export const END_LOADING = (loading) => {
  return {
    type: 'END_LOADING',
    loading
  }
}

export const GET_PRESENT = (artists) => {
  return {
    type: 'GET_PRESENT',
    artists
  }
}

export const ADD_PAST = (past) => {
  return {
    type: 'ADD_PAST',
    past
  }
}

export const RM_PAST = (past) => {
  return {
    type: 'RM_PAST',
    past
  }
}

export const CLEAR_PAST = () => {
  return {
    type: 'CLEAR_PAST'
  }
}

export const GET_TRACKS = (tracks) => {
  return {
    type: 'GET_TRACKS',
    tracks
  }
}

export const GET_PLAYING = (playing) => {
  return {
    type: 'GET_PLAYING',
    playing
  }
}

export const GET_SEARCH_RESULTS = (q, type) => {
  return (dispatch => {
    let api = API.search(q, type)
    if (api) {
      dispatch(START_LOADING())
      api.then(res => {
        if (res.statusText === 'OK') {
          dispatch(GET_SEARCH(res.data.artists.items))
          dispatch(END_LOADING())
        }
      })
    } else {
      // Mark a status
      return
    }
  })
}

export const CLEAR_SEARCH_RESULTS = () => {
  return (dispatch => {
    dispatch(CLEAR_SEARCH())
    dispatch(END_LOADING())
  })
}

export const GET_PRESENT_ARTIST = (id, ignoreId) => {
  let artists = {
    present: {},
    future: []
  }

  return (dispatch => {
    let api = API.artists(id)
    if (api) {
      dispatch(START_LOADING())
      api.then(res => {
        if (res.statusText === 'OK') {
          let imgUrl = res.data.images.length ? res.data.images[0].url : 'https://raw.githubusercontent.com/littlewin-wang/mufly/master/image/default-avatar.png'
          artists.present = {id: id, name: res.data.name, image: imgUrl}
          let apiInner = API.releatedArtists(id)
          if (apiInner) {
            apiInner.then(res => {
              if (res.statusText === 'OK') {
                if (res.data.artists && res.data.artists.length) {
                  for (let i = 0; i < res.data.artists.length; i++) {
                    imgUrl = res.data.artists[i].images.length ? res.data.artists[i].images[0].url : 'https://raw.githubusercontent.com/littlewin-wang/mufly/master/image/default-avatar.png'
                    let artist = {id: res.data.artists[i].id, name: res.data.artists[i].name, image: imgUrl}
                    if (artist.id !== ignoreId) {
                      artists.future.push(artist)
                    }
                    if (artists.future.length === 3) {
                      break
                    }
                  }
                }
                dispatch(END_LOADING())
                dispatch(GET_PRESENT(artists))
              }
            })
          } else {
            dispatch(END_LOADING())
            // Mark a status
            return
          }
        }
      })
    } else {
      // Mark a status
      return
    }
  })
}

export const ADD_PAST_ARTIST = (artist) => {
  return dispatch => {
    dispatch(ADD_PAST(artist))
  }
}

export const RM_PAST_ARTIST = (artist) => {
  return dispatch => {
    dispatch(RM_PAST(artist))
  }
}

export const CLEAR_PAST_ARTISTS = () => {
  return dispatch => {
    dispatch(CLEAR_PAST())
  }
}

export const GET_TOP_TRACKS = (id) => {
  return (dispatch => {
    let api = API.topTracks(id)
    if (api) {
      api.then(res => {
        if (res.statusText === 'OK') {
          if (res.data.tracks && res.data.tracks.length != 0) {
            let tracks = []
            let len = res.data.tracks.length < 3 ? res.data.tracks.length : 3
            for (let i = 0; i < len; i++) {
              let track = {id: res.data.tracks[i].id, name: res.data.tracks[i].name, url: res.data.tracks[i].preview_url}
              tracks.push(track)
            }
            dispatch(GET_TRACKS(tracks))
          } else {
            dispatch(GET_TRACKS([]))
          }
        }
      })
    } else  {
      // Mark a status
      return
    }
  })
}

export const GET_PLAYING_TRACK = (id) => {
  return (dispatch => {
    dispatch(GET_PLAYING(id))
  })
}
