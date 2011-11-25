require 'spec_helper'

describe MyMarks::Parser do
  describe "get_html" do
    it "downloads my stuff" do
      html = MyMarks::Parser.get_html('mymarks_test', 'mymarks_test_pw')
      html.should include('http://google.com')
    end
  end
end
