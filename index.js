$(document).ready(function(){
  //loadInFromData();
  //Dropdown Toggle
  var isListDropdownOn = false;
  var editListOn = false;
  $("#select-btn").click(function(e){
    if(!editListOn){
      toggleListDropdown();
    }
  });
  //Auto Save
  setInterval(function(){
    loadLocalData();
  },0.5*1000);
  //manual save
  // $("#save-btn").click(function(){
  //   loadLocalData();
  // });
  //List Toggle Function
  function toggleListDropdown(){
    isListDropdownOn = !isListDropdownOn;
    $("#select-btn i").toggleClass("on");
    $("#list-select-not-selected").finish().slideToggle();
  }
  //Adjusts filler when there are no lists
  function addListByFiller(){
    if($("#visible-list-select").children().length <= 2 && $("#list-select-not-selected").children().length == 0){
      $("#list-1").show();
      $("#list-1").addClass("selected");
    }else{
      $("#list-1").hide();
      $("#list-1").removeClass("selected");
      if($("#visible-list-select").children().length <= 2){
        $("#list-select-not-selected > .list-select-option").first().prependTo("#visible-list-select").addClass("selected");
      }
    }
  }
  $("body").on("click",".list-select-container",function(){
    if(isListDropdownOn){
      toggleListDropdown();
    }
  });
  //Add new list handler
  $("#add-list-btn").click(function(e,id,title){
    let listid;
    if(id === undefined){
      //Find available IDs
      listid = $(".list-select-option").length;
      for(let j = 0; j < $(".list-select-option").length; j++){
        if(!$("#list"+j).length){
          listid = j;
        }
      }
    }else{
      listid = id;
    }
    if(title === undefined){
      title = "";
    }
    //New List Dropdown
    $("#list-select-not-selected").append("\
    <div id='list"+listid+"' class='list-select-option'>\
      <span class='list-select-title'>"+title+"</span>\
      <span id='list-close"+listid+"' class='list-close'><i class='material-icons'>close</i></span>\
    </div>");
    $("#list").append("\
    <div id='list-display"+listid+"' class='each-list'></div>");
    addListByFiller();
    $("#list"+listid).hide();
    $("#list-display"+listid).sortable({
      handle:".item-move",
      axis: "y",
      revert: 400,
      placeholder: "item-placeholder",
      start: function(e, ui){
         ui.placeholder.height(ui.item.height());
      }
    });
    if($(".list-select-option").length >= 3){
      $("#list"+listid).slideDown();
    }else{
      $("#list"+listid).fadeIn().addClass("selected");
      $("#list-display"+listid).addClass("selected");
    }
    if(editListOn){
      $("#list"+listid+" .list-select-title").attr("contenteditable","true");
    }
    $("#list-close"+listid).click(function(e){
      e.stopPropagation();
      confirmModal("Are you sure you want to delete "+$("#list"+listid+" .list-select-title").text()+"?",function(){
        if(!($("#list"+listid).hasClass("selected"))){
          $("#list"+listid).slideUp(function(){
            $("#list"+listid).remove();
            addListByFiller();
          });
        } else {
          $("#list"+listid).fadeOut(function(){
            if($("#list-select-not-selected .list-select-option").first().length){
              let listDisplayFirst = $("#list-select-not-selected .list-select-option").first().attr("id");
              $("#list-display"+listDisplayFirst.charAt(listDisplayFirst.length-1)).addClass("selected");
              $("#list-select-not-selected .list-select-option").first().prependTo("#visible-list-select").addClass("selected");
            }
            $("#list-display"+listid).removeClass("selected");
            $("#list"+listid).remove();
            addListByFiller();
          });
        }

        $("#list-display"+listid).sortable();
        $("#list-display"+listid).sortable("destroy");
        $("#list-display"+listid).remove();
        removeListWhiteSpace();
      });
    });
    if(!isListDropdownOn && listid != id){
      toggleListDropdown();
    }
    $("#list"+listid).click(function(){
      if(!editListOn){
        if(!($(".list-select-option.selected").is("#list-1"))){
          let selectedId = $(".list-select-option.selected").attr("id");
          $("#list-display"+selectedId.charAt(selectedId.length-1)).removeClass("selected");
          $(".list-select-option.selected").appendTo("#list-select-not-selected").removeClass("selected");
        }
        $(this).prependTo("#visible-list-select").addClass("selected");
        $("#list-display"+listid).addClass("selected");
        addListByFiller();
        if(isListDropdownOn){
          toggleListDropdown();
        }
      }
    });
  });
  $("#edit-list").click(function(){
    editListOn = !editListOn;
    $(this).toggleClass("edit-list-on");
    if(editListOn){
      if(!isListDropdownOn){
        toggleListDropdown();
      }
      $(".list-select-title").attr("contenteditable","true");
    }else{
      $(".list-select-title").attr("contenteditable","false");
    }
  });

  $("#list-1").click(function(e){
    e.stopPropagation();
    $("#add-list-btn").trigger("click");
  });
  //New item handler
  var focusedContentEditable;
  $("#add-btn").click(function(e, id, content, selectedList){
    let itemid;
    if(selectedList == undefined){
      selectedList = ".each-list.selected";
    }
    if(id === undefined){
      itemid = $(".item").length;
      contentEditableDivs = $("[contenteditable='true'], [contenteditable='']");
      for(var i = 0; i < $(".item").length; i++){
        console.log($("#item"+i+"-"+$(selectedList).index()).length);
        if(!$("#item"+i+"-"+$(selectedList).index()).length){
          itemid = i;
          break;
        }
      }
    } else {
      itemid = id;
    }
    if(content === undefined){
      content="";
    }
    let fullItemId = "#item"+itemid+"-"+$(selectedList).index();
    if($(".each-list").length){
      $(selectedList).append("\
        <div id='"+fullItemId.substring(1,fullItemId.length)+"' class='item'>\
          <span class='item-done'><i class='material-icons'>check_box_outline_blank</i></span>\
          <span class='item-span' contenteditable='true'>"+content+"</span>\
          <span class='item-move'><i class='material-icons'>swap_vert</i></span>\
          <span class='item-close'><i class='material-icons'>close</i></span>\
        </div>\
      ");
      $(fullItemId).useAnimateCSS("fadeInDown");
      setTimeout(function() {
        $(fullItemId).removeAnimateCSS("fadeInDown");
      }, 1000);
      var thisBtn;
      $(".text-editor-btn").on("click."+fullItemId,function(){
        thisBtn = $(this);
        focusedContentEditable.focus();
        if(document.activeElement == $(fullItemId)[0] || document.activeElement == $(fullItemId+" .item-span")[0]){
          let fontSize = document.queryCommandValue("FontSize");
          let lastBtn;
          let lastColorBtn;
          console.log($(fullItemId+" .item-span"));
          $($(selectedList).attr("id")+" "+".item #item-span"+itemid).selectText();
          if($(this).attr("data-exec") !== undefined){
            if($(this).attr("data-prompt-color") === undefined){
              if($(this).attr("data-exec") !== "fontSize"){
                console.log($(this).attr("data-exec"))
                document.execCommand($(this).attr("data-exec"),false,null);
              } else if($(this).attr("data-exec") === "fontSize"){
                if($(this).attr("data-param") == "increase"){
                  fontSize++;
                  console.log("increase "+fontSize)
                } else if($(this).attr("data-param") == "decrease"){
                  fontSize--;
                  console.log("decrease "+fontSize)
                }
                document.execCommand("fontSize",null,fontSize);
              }

              if($(this).attr("data-exec") === "removeFormat"){
                $(".text-editor-btn").css("color","");
                $($(selectedList).attr("id")+" "+".item #item-span"+itemid).css("background-color", "");
              }
            }else{
              $("#color-prompt").trigger("click");
            }
          }else if($(this).attr("data-format") !== undefined){
            switch($(this).attr("data-format")){
              case "background":
                $("#color-prompt").trigger("click");
                break;
            }
          }
      }
      });
      $(fullItemId+" .item-close").click(function(){
        $(fullItemId).removeAnimateCSS("");
        $(fullItemId).useAnimateCSS("zoomOut");
        $(".text-editor-btn").off("click."+fullItemId);
        setTimeout(function() {
          $(fullItemId).off();
          $(fullItemId).hide();
          $(".item").last().children(".item-span").focus();
          if($(".each-list.selected").children().length <= 1){
            $(".each-list.selected").html("");
          }
          $(fullItemId).remove();
        },500);
      });
      $(fullItemId+" .item-done").click(function(){
        $(fullItemId).toggleClass("is-done");
        if($(fullItemId).hasClass("is-done")){
          $(fullItemId+" .item-done i").text("check_box");
        }else{
          $(fullItemId+" .item-done i").text("check_box_outline_blank");
        }
      });
      $(fullItemId+" .item-span").click(function(){
        focusedContentEditable = $(this);
        $("#rich-text-editor").attr("style","visibility:visible;");
        if($(this).offset().top - $("#rich-text-editor").height() > 0){
          $("#rich-text-editor").offset({top:$(this).offset().top - $("#rich-text-editor").height()});
        } else{
          $("#rich-text-editor").offset({top:$(this).offset().top + $(this).height()});
        }
        if($(this).offset().left + $("#rich-text-editor").width() < $(document).width()){
          $("#rich-text-editor").offset({left: $(this).offset().left});
        } else{
          $("#rich-text-editor").offset({left: $(this).offset().left - ($(this).offset().left + $("#rich-text-editor").width()-$(document).width())});
        }
      });
    }else{
      $("#list").useAnimateCSS("shake");
      $("html,body").css("overflow-x","hidden");
      setTimeout(function(){
        $("#list").removeAnimateCSS("shake");
        $("html,body").css("overflow-x","auto");
      }, 1000);
    }
  });
  $("#next-list").click(function(){
    $("#list-select-not-selected .list-select-option").first().trigger("click");
  });
  $(document).keydown(function(e){
    if(e.which == 13 && e.ctrlKey){
      e.preventDefault();
      $("#add-btn").trigger("click");
      $(".item .item-span").last().focus();
    }
    if(e.which == 8 && e.ctrlKey){
      e.preventDefault();
      $(".item").last().children(".item-close").trigger("click");
    }
  });
  function addTooltip(text, selector, direction){
    $("#tooltip").text(text);
  }
  function removeListWhiteSpace(){
    if($("#list").children().length == 0){
      $("#list").html("");
      $("#list").text("");
    }
  }
  //Modal and Themes
  $( "#settings-btn" ).click(function() {
  	$("#modals").show();
	  $("#settings-modal").show();
	  $("#settings-modal").useAnimateCSS("zoomIn");
	});

  $( "#clear2-btn" ).click(function() {
	  $("#settings-modal").hide();
	  $("#modals").hide();
	});

  $("#colorDefault").click(function() {
    $(".colorOptionButton.selected").removeClass("selected");
    $(this).addClass("selected");
    if($("#defaultThemeStylesheet").length == 0){
      $("#darkThemeStylesheet").remove();
      $("#lightThemeStylesheet").remove();
  	  $("head").append('<link id="defaultThemeStylesheet" rel="stylesheet" type="text/css" href="defaultTheme.css">');
    }
  });

  $("#colorLight").click(function() {
    $(".colorOptionButton.selected").removeClass("selected");
    $(this).addClass("selected");
    if($("#lightThemeStylesheet").length == 0){
      $("#darkThemeStylesheet").remove();
      $("head").append('<link id="lightThemeStylesheet" rel="stylesheet" type="text/css" href="lightTheme.css">');
  	  $("#defaultThemeStylesheet").remove();
    }
  });
    $("#colorDark").click(function() {
      $(".colorOptionButton.selected").removeClass("selected");
      $(this).addClass("selected");
      if($("#darkThemeStylesheet").length == 0){
        $("head").append('<link id="darkThemeStylesheet" rel="stylesheet" type="text/css" href="darkTheme.css">');
        $("#lightThemeStylesheet").remove();
        $("#defaultThemeStylesheet").remove();
      }
  });
  //CONFIRM FUNCTION ***********************************************************************************************************************************
  var confirmTrue = 0;
  function confirmModal(message,confirm){
    $("#modals").show();
    $("#confirm-message").text(message);
    $("#confirm").show().useAnimateCSS("zoomIn");
    $("#confirmBtn").one("click",function(){
      $("#confirm").hide();
      $("#modals").hide();
      confirm();
    });
    $("#cancelBtn").one("click",function(){
      $("#confirm").hide();
      $("#modals").hide();
    });
  }
  $("#clear-list").click(function(){
    confirmModal("Are you sure you want to delete all list items?",function(){
      if($(".each-list.selected").children().length != 0){
        $(".each-list.selected").useAnimateCSS("zoomOut");
        setTimeout(function() {
          $(".each-list.selected").children().each(function(){
            $(this).off();
            $(".text-editor-btn").off("click");
          });
          $(".each-list.selected").removeAnimateCSS("zoomOut");
          $(".each-list.selected").html("");
        },500);
      }
    });
  });
  loadInFromData();
  //Save and load data to local storage
  function loadLocalData(){
    localStorage.clear();
    for(let i = 0; i < $(".list-select-option:not('#list-1')").length; i++){
      localStorage.setItem("List"+i,$("#list"+i+" .list-select-title").text());
      for(let j = 0; j < $("#list-display"+i+" .item").length; j++){
        localStorage.setItem("Item"+j+"-"+i,$("#item"+j+"-"+i).hasClass("is-done")+","+$("#item"+j+"-"+i+" .item-span").html());
      }
    }
    localStorage.setItem("theme",$(".colorOptionButton.selected").length?$(".colorOptionButton.selected").text():"Gray");
  }
  //Load data from local storage into html
  function loadInFromData(){
    let currentList = 0;
    let currentItem = 0;
    let itemValue;
    while(localStorage.getItem("List"+currentList) !== undefined && localStorage.getItem("List"+currentList) !== null){
      $("#add-list-btn").trigger("click", [currentList, localStorage.getItem("List"+currentList)]);
      itemValue = localStorage.getItem("Item"+currentItem+"-"+currentList);
      while(itemValue !== undefined && itemValue !== null){
        $("#add-btn").trigger("click", [currentItem, itemValue.substring(itemValue.indexOf(",")+1,itemValue.length),"#list-display"+currentList]);
        if(itemValue.substring(0,itemValue.indexOf(",")) == "true"){
          console.log("check");
          $("#item"+currentItem+"-"+currentList+" .item-done").trigger("click");
        }
        currentItem++;
        itemValue = localStorage.getItem("Item"+currentItem+"-"+currentList);
      }
      currentItem=0;
      currentList++;
    }
    switch(localStorage.getItem("theme")){
      case "Dark":
      case "Light":
        $("#color"+localStorage.getItem("theme")).trigger("click");
        console.log("not default");
        break;
      case "Gray":
      default:
        console.log("default");
        $("#colorDefault").trigger("click");
        break;
    }
  }
});
