/**
 *
 *  -----------------------------------
 *  spotifyCurrentlyPlaying.js - v0.3.2
 *  -----------------------------------
 *
 *  Display your currently playing Spotify song(s) using Last.fm scrobbling.
 *
 *  https://github.com/kjbrum/spotifyCurrentlyPlaying.js
 *  @license Copyright (c) Kyle Brumm <http://kylebrumm.com>
 *
 */

function getSong(callback, name) {
            var lastfm_tracks = [];
            // Set the request URL for Last.fm
            var lastfm_request_url = 'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + name + '&api_key=ec3f6c4e29f6f0d003a2f44a224295ff&limit=' + 1 + '&format=json';

            // Make a request to the Last.fm API
            var request = new XMLHttpRequest();
            request.open('GET', lastfm_request_url, true);

            // Check for a successful response
            request.onload = function() {
                // Parse the response
                var data = JSON.parse(request.responseText);
                var tracks = data.recenttracks.track;
                // Check the status of the request
                if (request.status >= 200 && request.status < 400) {
                    nowplaying = "false"
                    if (tracks.length > 0) {
                        
                        // Update our values
                        if (tracks[0]) {
                            // Loop through the tracks
                            tracks.forEach(function(el, idx, arr) {
                                if (arr[idx].hasOwnProperty('@attr')) {
                                    if (arr[idx]["@attr"].hasOwnProperty('nowplaying')) {
                                        nowplaying = arr[idx]["@attr"]["nowplaying"];
                                    };
                                };
                                lastfm_tracks[idx] = {
                                    title: arr[idx].name,
                                    artist: arr[idx].artist['#text'],
                                    album: arr[idx].album['#text']
                                };
                            });
                        } else {
                            if (tracks.hasOwnProperty('@attr')) {
                                if (tracks["@attr"].hasOwnProperty('nowplaying')) {
                                    nowplaying = tracks["@attr"]["nowplaying"];
                                };
                            };
                            lastfm_tracks.push({
                                title: tracks.name,
                                artist: tracks.artist['#text'],
                                album: tracks.album['#text']
                            });
                        }
                    }

                    // Run the callback function
                    callback(lastfm_tracks[0].artist, lastfm_tracks[0].title, nowplaying);
                } else {
                    // Error from the server
                    throw data.message;
                }
            };

            // Handle any errors
            request.onerror = function() {
                // Connection error
                throw 'connection error';
            };

            // Send the request
            request.send();
        }