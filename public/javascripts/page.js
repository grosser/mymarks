MM = {}
MM.page = function($base){
  this.root = false;
  this.breadcrumb = [];
  var back = $base.find('#back_button');
  var self = this;

  function login(){
    var url = '/bookmarks?' + $(this).serialize();
    $.get(url).success(function(data){
      self.root = parseBookmarks(data);
      self.breadcrumb = [self.root];
      $.mobile.changePage('#bookmarks');
      displayBookmarks(self.root);
    }).error(function(){
      alert("Error downloading bookmarks. Username/password wrong?")
    });
    return false;
  }

  function redirectToHomeOnEmptyBookmarks(){
    if(!this.root){
      $.mobile.changePage('#index');
    }
  }

  function parseBookmarks(data){
    var Foxmarks = {BookmarkManager: {}}
    eval(eval(data));
    return {text: 'All', children: Foxmarks.BookmarkManager.bookmarks};
  }

  function displayableChildren(node){
    return $.grep(node.children, function(e){
      return !(e.href || '').match(/^place:/)
    })
  }

  function displayBookmarks(node){
    updateBackButtonText();
    updateUrl();

    var $list = $('#bookmark_list');
    $list.empty();
    var bookmarks = displayableChildren(node);
    $.each(bookmarks, function(i,child){
      var li = $('<li>');
      li.append(buildBookmark(child));
      $list.append(li);
    });
    $list.listview("refresh"); // hangs when page is not already at #bookmarks
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
    if(node.leaf) return; // normal link

    self.breadcrumb.push(node)
    displayBookmarks(node)

    return false;
  }

  function onBackClick(){
    if(self.breadcrumb.length == 1){
      $.mobile.changePage('#index'); // logout
    } else {
      self.breadcrumb.pop();
      displayBookmarks(self.breadcrumb.last());
    }
    return false;
  }

  function updateBackButtonText(){
    if(self.breadcrumb.length == 1){
      var text = 'Logout'
    } else {
      var text = self.breadcrumb[self.breadcrumb.length-2].text;
    }
    back.find('.ui-btn-text').text(text);
  }

  // [All, x, y] -> #bookmarks-x-y
  function updateUrl(){
    console.log(self.breadcrumb.slice(1))
    var ids = $.map(self.breadcrumb.slice(1), cleanId);
    ids.unshift("bookmarks");
    window.location.hash = "#" + ids.join('-');
  }

  function cleanId(node){
    return node.id.match(/\d+/)[0]
  }

  redirectToHomeOnEmptyBookmarks();

  $base.find('#login').submit(login);
  back.click(onBackClick);
}
