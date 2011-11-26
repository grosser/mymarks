MM = {}
MM.page = function($base){
  this.bookmarks = {};
  this.breadcrumb = [];
  var back = $base.find('#back_button');
  var self = this;

  function login(){
    var url = '/bookmarks?' + $(this).serialize();
    $.get(url).success(function(data){
      parseBookmarks(data)
      $.mobile.changePage('#bookmarks');
      displayBookmarks(self.bookmarks);
    }).error(function(){
      alert("Error downloading bookmarks. Username/password wrong?")
    });
    return false;
  }

  function redirectToHomeOnEmptyBookmarks(){
    if(!this.bookmarks){
      $.mobile.changePage('#index');
    }
  }

  function parseBookmarks(data){
    var Foxmarks = {BookmarkManager: {}}
    eval(eval(data));
    self.bookmarks = Foxmarks.BookmarkManager.bookmarks;
  }

  function displayableBookmarks(bookmarks){
    return $.grep(bookmarks, function(e){
      return !(e.href || '').match(/^place:/)
    })
  }

  function displayBookmarks(bookmarks){
    var $list = $('#bookmark_list');
    $list.empty();
    var bookmarks = displayableBookmarks(bookmarks)
    $.each(bookmarks, function(i,node){
      var li = $('<li>');
      li.append(buildBookmark(node));
      $list.append(li);
      $list.listview("refresh");
    })
  }

  function buildBookmark(node){
    var a = $('<a>');
    a.text(node.text);
    a.attr('data-transition', 'slide');
    a[0].mm_node = node;
    a.attr('href', node.href);
    a.addClass(node.leaf ? 'leaf' : 'folder');
    a.click(onBookmarkClick);
    a.prepend(buildImage(node));
    return a;
  }

  // build link or folder icon
  function buildImage(node){
    var $image = $('<img>');
    if(node.leaf){
      $image.attr('src', '/images/document.png');
      preloadFavicon($image, node.href);
    } else {
      $image.attr('src', '/images/folder.png');
    }
    return $image;
  }

  // create a preloaded image, that replaces the other when loaded
  function preloadFavicon($image, url){
    var favicon = $.url(url).attr('base') + '/favicon.ico'
    var pre_loader = $('<img>').attr('src', favicon)
    pre_loader.load(function(){
      $image.attr('src', favicon)
    })
  }

  function onBookmarkClick(){
    var node = this.mm_node;
    var $a = $(this);
    if(node.leaf) return; // normal link

    displayBookmarks(node.children)

    // keep track of breadcrumb
    self.breadcrumb.push(node.id)
    updateBackButtonText();

    return false;
  }

  function onBackClick(){
    if(self.breadcrumb.length == 0){
      // logout
      $.mobile.changePage('#index');
    } else {
      // find the current folder by going through the bookmarks
      // via the node-ids in the breadcrumb
      self.breadcrumb.pop();
      var node = nodeByBreadcrumb(self.breadcrumb);
      displayBookmarks(node ? node.children : self.bookmarks);
      updateBackButtonText();
    }
    return false;
  }

  function nodeByBreadcrumb(breadcrumb){
    if(breadcrumb.length == 0) return;

    var nodes = self.bookmarks;
    $.each(breadcrumb, function(i,id){
      nodes = $.grep(nodes, function(node){
        return node.id == id;
      })[0];
    });
    return nodes;
  }

  function updateBackButtonText(){
    var text;
    if(self.breadcrumb.length == 0){
      text = 'Logout'
    } else {
      var breadcrumb_to_parent = self.breadcrumb.slice(0,-1)
      var parent_node = nodeByBreadcrumb(breadcrumb_to_parent);
      if(parent_node){
        text = parent_node.text;
      } else {
        text = 'All'
      }
    }

    back.find('.ui-btn-text').text(text)
  }

  redirectToHomeOnEmptyBookmarks()

  $base.find('#login').submit(login)
  back.click(onBackClick)
}
