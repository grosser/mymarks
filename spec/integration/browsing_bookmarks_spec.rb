require 'spec_helper'

describe "browsing bookmarks", :js => true do
  def click_css(css)
    page.find(css).click
  end

  before do
    MyMarks::Parser.stub!(:get_html).and_return File.read('spec/fixtures/bookmarks.txt')
  end

  it "loads my bookmarks" do
    visit "/"
    page.should have_content('MyMarks')
    fill_in 'username', :with => 'mymarks_test'
    fill_in 'password', :with => 'mymarks_test_pw'
    click_css '#login input[type=submit]'
    wait_until{ page.has_content? 'Google' }
  end
end
