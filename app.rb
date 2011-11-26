require 'environment'

error_logger = Logger.new('log/errors.log', 3, 10*1024*1024)
error do
  error = request.env['sinatra.error']
  info = "Application error\n#{error}\n#{error.backtrace.join("\n")}"

  error_logger.info info
  Kernel.puts info

  'Application error'
end

set :views, 'views'
set :public, 'public' # shotgun serves them but rackup does not ...

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
