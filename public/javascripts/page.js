MM = {}
MM.page = function($base){
  var root = false;
  var breadcrumb = [];
  var back = $base.find('#back_button');

  function login(){
    var url = '/bookmarks?' + $(this).serialize();
    $.get(url).success(function(data){
      root = parseBookmarks(data);
      breadcrumb = [root];
      $.mobile.changePage('#bookmarks');
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

    breadcrumb.push(node)
    updateHash();

    return false;
  }

  function onBackClick(){
    if(breadcrumb.length == 1){
      $.mobile.changePage('#index'); // logout
    } else {
      breadcrumb.pop();
      updateHash();
    }
    return false;
  }

  function updateBackButtonText(){
    if(breadcrumb.length == 1){
      var text = 'Logout'
    } else {
      var text = breadcrumb[breadcrumb.length-2].text;
    }
    back.find('.ui-btn-text').text(text);
  }

  // [All, x, y] -> #bookmarks-x-y
  function updateHash(){
    var ids = $.map(breadcrumb.slice(1), cleanId);
    ids.unshift("bookmarks");
    window.location.hash = "#" + ids.join('-');
  }

  function hashChanged(){
    if(!root) return;
    var ids = window.location.hash.split('-');
    if(ids.shift() != '#bookmarks') return;
    breadcrumb = matchedNodesByIds(ids);
    displayBookmarks(breadcrumb.last());
  }

  function matchedNodesByIds(ids){
    var matchedNodes = [root];
    $.each(ids, function(i,id){
      var children = matchedNodes.last().children;
      var matched = $.grep(children, function(node){ return cleanId(node) == id })[0];
      matchedNodes.push(matched);
    });
    return matchedNodes;
  }

  function cleanId(node){
    return node.id.replace(/[^a-z\d+]/g,'');
  }

  redirectToHomeOnEmptyBookmarks();

  $(window).hashchange(hashChanged);
  $base.find('#login').submit(login);
  back.click(onBackClick);
}
