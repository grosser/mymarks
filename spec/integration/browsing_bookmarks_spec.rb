require 'spec_helper'

describe "browsing bookmarks", :js => true do
  def click_css(css)
    page.find(css).click
  end

  def login
    visit "/"
    page.should have_content('MyMarks')
    fill_in 'username', :with => 'mymarks_test'
    fill_in 'password', :with => 'mymarks_test_pw'
    click_css '#login input[type=submit]'
  end

  before do
    MyMarks::Parser.stub!(:get_html).and_return File.read('spec/fixtures/bookmarks.txt')
    login
  end

  it "loads my bookmarks" do
    wait_until{ page.has_content? 'Google' } # entry
    wait_until{ page.has_content? 'F1' } # folder
    page.should_not have_content 'Firefox' # 'place:' bookmark that should be hidden
  end

  it "allows me to click into folders" do
    click_css "a[data-type=folder]"
    wait_until{ page.has_content? 'Yahoo' } # entry in F1
  end
end
