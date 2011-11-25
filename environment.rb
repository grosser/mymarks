require 'rubygems'
require 'bundler'
Bundler.setup
Bundler.require

require 'mechanize'
require 'digest/md5'
$LOAD_PATH << './lib'
require 'mymarks/parser'

if File.exist?('config/newreclic.yml')
  NewRelic::Control.instance.init_plugin(:env => Sinatra::Application.environment.to_s)
end
