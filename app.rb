require 'environment'
require 'error_logger'

set :views, 'views'
set :public_folder, 'public' # shotgun serves them automatically but rackup does not ...

use Rack::SSL if production?

CACHE = {}

get "/bookmarks" do
  key = [params[:username], params[:password]]
  @bookmarks = CACHE[key] ||= MyMarks::Parser.get_html(params[:username], params[:password])
  if @bookmarks
    @bookmarks.force_encoding('utf-8').to_json
  else
    error 403, "Authorisation failed"
  end
end

get '/' do
  erb :index
end
