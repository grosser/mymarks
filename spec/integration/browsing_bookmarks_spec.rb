require 'spec_helper'

describe "browsing bookmarks", :js => true do
  # general helpers
  def click_css(css)
    page.find(css).click
  end

  def current_path_info
    current_url.sub(%r{.*?://},'')[%r{[/\?\#].*}] || '/'
  end

  # for this test
  def login
    visit "/"
    page.should have_content('MyMarks')
    fill_in 'username', :with => 'mymarks_test'
    fill_in 'password', :with => 'mymarks_test_pw'
    click_css '#login input[type=submit]'
  end

  def assert_back_button_is(text)
    wait_until(1){ page.find('#back_button').has_content? text }
  end

  def assert_content(text)
    wait_until(1){ page.find('.ui-page-active').has_content? text }
  end

  def click_first_folder
    click_css "a.folder"
  end

  def click_back
    click_css "#back_button"
  end

  before do
    MyMarks::Parser.stub!(:get_html).and_return File.read('spec/fixtures/bookmarks.txt')
  end

  context "when logged in" do
    before do
      login
    end

    it "loads my bookmarks" do
      assert_content 'Google'
      assert_content 'F1'
      page.should_not have_content 'Firefox' # 'place:' bookmark that should be hidden
      page.should_not have_content 'F2' # nested folder
    end

    it "allows me to click into a folders" do
      click_first_folder
      assert_content 'Yahoo' # entry in F1
      assert_back_button_is 'All'
      page.should_not have_content 'Google'
    end

    it "allows me to click out of a folders" do
      click_first_folder
      assert_content 'Yahoo' # entry in F1
      assert_back_button_is 'All'

      click_back
      assert_content 'Google' # entry in All
      assert_back_button_is 'Logout'
    end

    it "allows me to click out of a nested folders" do
      click_first_folder
      assert_content 'Yahoo' # entry in F1
      assert_back_button_is 'All'

      click_first_folder
      assert_content 'Bing' # entry in F2
      assert_back_button_is 'F1'

      click_back
      assert_content 'Yahoo' # entry in F1
      assert_back_button_is 'All'
    end

    it "logs me out when hitting back-button too often" do
      click_first_folder
      assert_content 'Yahoo' # entry in F1
      assert_back_button_is 'All'

      click_back
      assert_back_button_is 'Logout'

      click_back
      assert_content 'My Bookmarks'
    end

    it "shows breadcrumb in url, so I can use my browser back button" do
      click_first_folder
      current_path_info.should == '/#bookmarks-F1'
      click_back
      current_path_info.should == '/#bookmarks'
    end
  end

  it "goes home when my bookmarks are not loaded" do
    visit "/#bookmarks"
    current_path_info.should == '/'
  end
end
