require 'spec_helper'

describe "browsing bookmarks", :js => true do
  def click_css(css)
    page.find(css).click
  end

  def current_path_info
    current_url.sub(%r{.*?://},'')[%r{[/\?\#].*}] || '/'
  end

  def alert
    page.driver.browser.switch_to.alert.text
  ensure
    # alerts would stay open after tests finish
    page.driver.browser.switch_to.alert.accept
  end

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

  def execute_javascript(code)
    page.driver.execute_script(code)
  end

  before do
    MyMarks::Parser.stub(:cached_get_html).and_return File.read('spec/fixtures/bookmarks.txt')
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

    it "logs me out when hitting Logout" do
      assert_back_button_is 'Logout'
      click_back
      assert_content 'Load My Bookmarks'

      visit "#bookmarks"
      current_path_info.should == "/"
    end

    it "logs me out when hitting back-button too often" do
      click_first_folder
      assert_content 'Yahoo' # entry in F1
      assert_back_button_is 'All'

      click_back
      assert_back_button_is 'Logout'

      click_back
      assert_content 'Load My Bookmarks'
    end

    it "shows breadcrumb in url, so I can use my browser back button" do
      click_first_folder
      current_path_info.should == '/#bookmarks-fbmn1322251224360'
      click_back
      current_path_info.should == '/#bookmarks'
    end

    it "lets me use my browser history" do
      visit "/#bookmarks-fbmn1322251224360"
      assert_back_button_is 'All'
      assert_content 'Yahoo'

      visit "/#bookmarks"
      assert_back_button_is 'Logout'
      assert_content 'Google'
    end
  end

  it "goes home when my bookmarks are not loaded" do
    visit "/#bookmarks"
    current_path_info.should == '/'
  end

  context "errors" do
    it "shows an error when my bookmarks could not be loaded" do
      MyMarks::Parser.stub(:cached_get_html).and_return nil
      visit '/'
      fill_in 'username', :with => 'mymarks_test'
      fill_in 'password', :with => 'mymarks_test'
      click_css '#login input[type=submit]'
      alert.should include "Username"
    end

    it "shows an error when my bookmarks time out" do
      MyMarks::Parser.stub(:cached_get_html).and_return File.read('spec/fixtures/bookmarks.txt')
      visit '/'
      fill_in 'username', :with => 'mymarks_test'
      fill_in 'password', :with => 'mymarks_test'
      execute_javascript "MM.LOAD_TIMEOUT = 1"
      click_css '#login input[type=submit]'
      alert.should include "Timeout"
    end
  end
end
