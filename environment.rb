require 'rubygems'
require 'bundler'
Bundler.setup
Bundler.require

require 'digest/md5'
require 'logger'
$LOAD_PATH << './lib'
require 'mymarks/parser'

if File.exist?('config/newreclic.yml')
  NewRelic::Control.instance.init_plugin(:env => Sinatra::Application.environment.to_s)
end
