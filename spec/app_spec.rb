require 'spec_helper'

require 'sinatra'
require 'rack/test'
require 'app'

describe 'App' do
  include Rack::Test::Methods

  def app
    Sinatra::Application.new
  end

  it "returns error when hash does not match" do
    post "bookmarks", 'username' => 'mymarks_test', 'password' => 'mymarks_test_pw'
    last_response.body.should == 'xxx'
  end
end
