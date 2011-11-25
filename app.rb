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

get "/bookmarks" do
  @bookmarks = MyMarks::Parser.get_html(params[:username], params[:password])
  @bookmarks.to_json
end

get '/' do
  erb :index
end
