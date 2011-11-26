This is a very simple mobile viewer for XMarks.<br/>
(which already has an android app that is far superior to this)

It uses sinatra and jquery mobile and is tested via rspec + capybara + selenium.

Passwords are not stored, just simply passed to XMarks to ge the bookmarks.

## [Go Play](http://mymarks.heroku.com)

Development
===========

    bundle
    bundle exec shotgun
    open http://localhost:9393

Test: `bundle exec rake`


Authors
=======
This is a rewrite of a Hacknight project I did with [vernonR2](https://github.com/vernonR2).

[Michael Grosser](http://grosser.it)<br/>
michael@grosser.it<br/>
License: MIT<br/>


