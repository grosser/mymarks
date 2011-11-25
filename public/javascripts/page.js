MM = {}
MM.page = function($base){
  this.bookmarks = {}
  var back = $base.find('#back_button')

  function login(){
    var url = '/bookmarks?' + $(this).serialize();
    $.get(url).success(function(data){
      parseBookmarks(data)
      $.mobile.changePage('#bookmarks');
      displayBookmarks(MM.bookmarks);
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
    MM.bookmarks = Foxmarks.BookmarkManager.bookmarks;
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
      var li = $('<li>')
      li.append(buildBookmark(node))
      $list.append(li)
      $list.listview("refresh");
    })
  }

  function buildBookmark(node){
    var a = $('<a>')
    a.text(node.text)
    a.attr('data-transition', 'slide')
    a.attr('data-type', node.leaf ? 'link' : 'folder')
    a[0].mm_node = node

    if(node.leaf){
      // simple link
      a.attr('href', node.href)
    } else {
      // folder
      a.click(function(){
        displayBookmarks(node.children)
        return false;
      })
    }

    a.click(onBookmarkClick)
    image = buildImage(node)
    a.prepend(image)

    return a;
  }

  // build link or folder icon
  function buildImage(node){
    var $image = $('<img>')
    if(node.leaf){
      $image.attr('src', '/images/document.png')
      preloadFavicon($image, node.href)
    } else {
      $image.attr('src', '/images/folder.png')
    }
    return $image
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
    var $a = $(this)
    if($a.attr('data-type') == 'folder'){
      back.find('.ui-btn-text').text($a.text())
      back[0].mm_node = this.mm_node
    }
  }

  function onBackClick(){
    console.log(this.mm_node)
    displayBookmarks(this.mm_node)
  }

  redirectToHomeOnEmptyBookmarks()

  $base.find('#login').submit(login)
  back.click(onBackClick)
}
