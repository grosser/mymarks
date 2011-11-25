require 'environment'

error_logger = Logger.new('log/errors.log', 3, 10*1024*1024)
error do
  error = request.env['sinatra.error']
  info = "Application error\n#{error}\n#{error.backtrace.join("\n")}"

  error_logger.info info
  Kernel.puts info

  'Application error'
end

get "/bookmarks" do
  @bookmarks = MyMarks::Parser.get_html(params[:username], params[:password])
  render @bookmarks.to_json
end

get '/' do
  render 'views/index.erb'
end
