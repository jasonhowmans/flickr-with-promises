/**!
 * A simple flickr get library for easily returning photos from the various
 * flickr api outputs. Uses promises.
 * @copyright Jason Howmans
 */

(function flickrService() {
  var flickrApiKey = ''; /* Fill these out with your account details */
  var flickrUserId = ''; /* Easily found @ http://idgettr.com */
  var flickrApiUrl = 'https://api.flickr.com/services/rest/';

  // Bind it to `this` (usually window)
  this.flickr = new Flickr();

  function Flickr() {}

  Flickr.prototype.photoset = getFromSet;
  Flickr.prototype.photos = getPhotos;

  // Implementation details are below ..........................................

  /**!
   * For making a call to the flickr api. This is a wrapper that abstracts the
   * repeititive crap.
   * @param {Object} options – example options object:
   *     {
   *        method: 'post',
   *        path: 'services/api/explore/flickr.photosets.getPhotos',
   *        data: {
   *          param: 'blah',
   *        },
   *     }
   */
  function apiCall(options) {
    if (typeof options !== 'object') {
      return new TypeError('Options object needed to talk with flickr, yo');
    }

    return new Promise(handler);

    function handler(resolve, reject) {
      var httpOpts = {
        accept: 'application/json',
        url: flickrApiUrl,
        method: options.method,
        data: {
          api_key: flickrApiKey,
          user_id: flickrUserId,
          format: 'json',
          nojsoncallback: 1,
        }
      };

      if (options.hasOwnProperty('data')) {
        $.extend(httpOpts.data, options.data);
      }

      $.ajax(httpOpts)
       .done(resolve)
       .fail(reject);
    }
  };


  /**!
   * For getting available photo sizes
   * @param {String} photoId – the id of the picture
   * @returns {Object} containing pictures
   */
  function getPhotos(photoId) {
    if (typeof photoId !== 'string') {
      return new TypeError('photoId should be a string, yo');
    }

    return new Promise(handler);

    function handler(resolve, reject) {
      var apiOptions = {
        method: 'get',
        data: {
          method: 'flickr.photos.getSizes',
          photo_id: photoId,
        },
      };

      apiCall(apiOptions)
        .then(resolve, reject);
    }
  }


  /**!
   * For returning a set of photos based off the `setId`. Uses the apiCall
   * method for heavy listing
   * @param {String} setId – ID of the ser to request (long string of numbers)
   * @return Promise <data|error>
   */
  function getFromSet(setId) {
    if (typeof setId !== 'string') {
      return new TypeError('setId should be a string, yo');
    }

    return new Promise(handler);

    function handler(resolve, reject) {
      var apiOptions = {
        method: 'get',
        data: {
          method: 'flickr.photosets.getPhotos',
          photoset_id: setId
        },
      };

      apiCall(apiOptions)
        .then(resolve, reject);
    }
  }
}.bind(window)());
