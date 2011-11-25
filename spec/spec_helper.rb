$LOAD_PATH << File.dirname(File.dirname(__FILE__))
require 'app'

require 'rack/test'
require 'capybara'
require 'capybara/dsl'

Capybara.app = Sinatra::Application.new

RSpec.configure do |config|
  Capybara.current_driver = :selenium
  config.include Capybara::DSL
end
