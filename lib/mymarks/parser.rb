require 'mechanize'

module MyMarks
  module Parser
    def self.get_html(username, password)
      agent = Mechanize.new

      # login
      login = agent.get 'https://login.xmarks.com/'
      form = login.form
      form.username = username
      form.password = password
      form.passwordhash = Digest::MD5.hexdigest(password)
      agent.submit form

      # get data
      js_response = agent.get "https://my.xmarks.com/bookmarks/syncd_read"
      return if js_response.body.strip =~ /^<html/
      js_response.body
    end
  end
end
