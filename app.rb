require 'environment'

set :views, 'views'
set :public_folder, 'public' # shotgun serves them automatically but rackup does not ...
set :logging, true
set :dump_errors, true
set :raise_errors, true

use Rack::SSL if production?

post "/bookmarks" do
  @bookmarks = MyMarks::Parser.cached_get_html(params[:username], params[:password])
  if @bookmarks
    @bookmarks.force_encoding('utf-8').to_json
  else
    error 403, "Authorisation failed"
  end
end

get '/' do
  erb :index
end
