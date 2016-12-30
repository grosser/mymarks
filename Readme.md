This is a very simple mobile viewer for XMarks.<br/>
(which already has an android app that is far superior to this)

It uses sinatra and jquery mobile and is tested via rspec + capybara + selenium.

Passwords are not stored, just simply passed to XMarks to ge the bookmarks.

![Login screen](assets/mymarks1.png?raw=true)
![Bookmarks screen](assets/mymarks2.png?raw=true)

## [Go Play](http://mymarks.herokuapp.com)

Development
===========

    bundle
    bundle exec shotgun
    open http://localhost:9393

Test: `bundle exec rake`

TODO
====
 - favicons from non-https urls make browsers unhappy <-> fallback to http after login or try both or proxy
 - localstore <-> no need to enter password every time (+ refresh button)
 - Uncaught URIError: URI malformed `jquery.url.js:32`, rescue from malformatted urls

Authors
=======
This is a rewrite of a Hacknight project I did with [vernonR2](https://github.com/vernonR2).

[Michael Grosser](http://grosser.it)<br/>
michael@grosser.it<br/>
License: MIT<br/>


