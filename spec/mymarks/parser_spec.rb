require 'spec_helper'

describe MyMarks::Parser do
  describe ".cached_get_html" do
    it "caches the results" do
      MyMarks::Parser.stub(:get_html).and_return 1
      MyMarks::Parser.cached_get_html(1,2).should == 1
      MyMarks::Parser.stub(:get_html).and_return nil
      MyMarks::Parser.cached_get_html(1,2).should == 1
    end
  end

  describe ".get_html" do
    it "downloads my stuff" do
      html = MyMarks::Parser.get_html('mymarks_test', 'mymarks_test_pw')
      html.should include('http://google.com')
    end

    it "fails with wrong username/password" do
      html = MyMarks::Parser.get_html('mymarks_test', 'mymarks_test')
      html.should == nil
    end
  end
end
