require 'spec_helper'

describe "browsing bookmarks" do
  it "xxx", :js => true do
    visit "/"
    page.should have_content('MyMarks')
  end
end
