/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var path = require('path')
var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 3000))

app.use('/', express.static(path.join(__dirname, 'public')))

// Additional middleware which will set headers that we need on each request.
app.use(function (req, res, next) {
  // Disable caching so we'll always get the latest comments.
  res.setHeader('Cache-Control', 'no-cache')
  next()
})

app.listen(app.get('port'), function () {
  console.log('Server started: http://localhost:' + app.get('port') + '/')
})
