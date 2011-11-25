task :default do
  ENV['RACK_ENV'] = 'test'
  exec "rspec spec/"
end

task :update_fixtures do
  require './lib/mymarks/parser'
  html = MyMarks::Parser.get_html('mymarks_test','mymarks_test_pw')
  File.open('spec/fixtures/bookmarks.txt','w'){|f| f.write(html) }
end
