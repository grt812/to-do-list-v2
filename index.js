$(document).ready(function(){
  //Dropdown Toggle
  var isListDropdownOn = false;
  var editListOn = false;
  $("#list-select").click(function(e){
    if(!editListOn){
      toggleListDropdown();
    }
  });
  //List Toggle Function
  function toggleListDropdown(){
    isListDropdownOn = !isListDropdownOn;
    $("#select-btn i").toggleClass("on");
    $("#list-select-not-selected").finish().slideToggle();
  }
  //Adjusts filler when there are no lists
  function addListByFiller(){
    console.log("number of visible: "+$("#visible-list-select").children().length)
    console.log("number of dropdown: "+$("#list-select-not-selected").children().length)
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
  //Add new list handler
  $("#add-list-btn").click(function(e){
    //Find available IDs
    let listid = $(".list-select-option").length;
    for(let j = 1; j <= $(".list-select-option").length; j++){
      if(!$("#list"+j).length){
        listid = j;
      }
    }
    //New List Dropdown
    $("#list-select-not-selected").append("\
    <div id='list"+listid+"' class='list-select-option'>\
      <span class='list-select-title'>New List</span>\
      <span id='list-close"+listid+"' class='list-close'><i class='material-icons'>close</i></span>\
    </div>");
    $("#list").append("\
    <div id='list-display"+listid+"' class='each-list'></div>");
    addListByFiller();
    $("#list"+listid).hide();
    $("#list"+listid).sortable({
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
      $("#list"+listid).attr("contenteditable","true");
    }
    $("#list-close"+listid).click(function(e){
      e.stopPropagation();
      confirmModal("Are you sure you want to delete "+$("#list"+listid+" .list-select-title").text()+"?",function(){
        removeListWhiteSpace();
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
        console.log($("#list-display"+listid));
        $("#list-display"+listid).sortable();
        $("#list-display"+listid).sortable("destroy");
        $("#list-display"+listid).remove();
        console.log($("#list-select-not-selected").children().length);
        console.log($("#visible-list-select").children().length);
        console.log(($("#list-select-not-selected").children().length != 0 && $("#visible-list-select").children().length >= 2));
      });
    });
    if(!isListDropdownOn){
      toggleListDropdown();
    } else {
      console.log(isListDropdownOn);
    }
    $("#list"+listid).click(function(){
      console.log(editListOn);
      if(!editListOn){
        if(!($(".list-select-option.selected").is("#list-1"))){
          let selectedId = $(".list-select-option.selected").attr("id");
          $("#list-display"+selectedId.charAt(selectedId.length-1)).removeClass("selected");
          $(".list-select-option.selected").appendTo("#list-select-not-selected").removeClass("selected");
        }
        $(this).prependTo("#visible-list-select").addClass("selected");
        $("#list-display"+listid).addClass("selected");
        addListByFiller();
      }
    });
  });
  $("#edit-list").click(function(){
    editListOn = !editListOn;
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
  function onItemChange(){
    loadLocalData();
  };
  function loadLocalData(){
    localStorage.clear();
    for(let i = 0; i < $(".list-option-select:not(#list-1)").length; i++){
      for(let j = 0; j < $(".item").length; j++){
        localStorage.setItem("Item"+j+"List"+i, $(".item").eq(j).html());
        localStorage.setItem("ItemCompleted"+j, $(".item").data("is-done"));
      }
      localStorage.setItem("List"+i, $(".list-select-option").eq(i).text());
    }
  }
  function displayLocalData(){
    while(false){

    }
  }
  function onItemRemove(){
    onItemChange();
  };
  function onItemAdd(){
    onItemChange();
  };
  function onItemEdit(){
    onItemChange();
  };
  //New item handler
  var focusedContentEditable;
  $("#add-btn").click(function(){
    let itemid = $(".item").length;
    contentEditableDivs = $("[contenteditable='true'], [contenteditable='']");
    for(var i = 0; i < $(".item").length; i++){
      if(!$("#item"+i).length){
        itemid = i;
        break;
      }
    }
    console.log($(".each-list.selected").length);
    if($(".each-list.selected").length){
      $(".each-list.selected").append("\
        <div id='item"+itemid+"' class='item' data-is-done='false'>\
          <span id='item-done"+itemid+"' class='item-done'><i class='material-icons'>check_box_outline_blank</i></span>\
          <span id='item-span"+itemid+"' class='item-span' contenteditable='true'>New Item</span>\
          <span id='item-move"+itemid+"' class='item-move'><i class='material-icons'>swap_vert</i></span>\
          <span id='item-close"+itemid+"' class='item-close'><i class='material-icons'>close</i></span>\
        </div>\
      ");
      $("#item"+itemid).useAnimateCSS("fadeInDown");
      setTimeout(function() {
        $("#item"+itemid).removeAnimateCSS("fadeInDown");
      }, 1000);
      onItemAdd(itemid);
      var thisBtn;
      $(".text-editor-btn").on("click.item"+itemid,function(){
        thisBtn = $(this);
        focusedContentEditable.focus();
        if(document.activeElement == $("#item"+itemid)[0] || document.activeElement == $("#item-span"+itemid)[0]){
          let fontSize = document.queryCommandValue("FontSize");
          let lastBtn;
          let lastColorBtn;
          console.log($("#item-span"+itemid));
          $("#item-span"+itemid).selectText();
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
                $("#item"+itemid).css("background-color", "");
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
      $("#item-close"+itemid).click(function(){
        onItemRemove($("#item"+itemid));
        if($(".each-list.selected").children().length < 1){
          $(".each-list.selected").html("");
        } else {
          console.log("length "+$(".each-list.selected").children().length);
        }
        $("#item"+itemid).addClass("zoomOut animated");
        $(".text-editor-btn").off("click.item"+itemid);
        setTimeout(function() {
          $("#item"+itemid).off();
          $("#item-"+itemid).sortable("disabled");
          $("#item"+itemid).remove();
        },500);
      });
      $("#item-done"+itemid).click(function(){
        $("#item"+itemid).toggleClass("is-done");
        if($("#item"+itemid).hasClass("is-done")){
          $("#item-done"+itemid+" i").text("check_box");
        }else{
          $("#item-done"+itemid+" i").text("check_box_outline_blank");
        }
      });
      $("#item"+itemid+" .item-span").click(function(){
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
      $("#item"+itemid+" .item-span").on("blur keyup paste input",function(){
        onItemEdit();
        console.log("Edit");
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
  function removeListWhiteSpace(){
    if($("#list").children().length == 0){
      $("#list").html("");
    }
  }
  // $("#clear-list").click(function(){
  //   if(confirm("Are you sure you want to delete all list items?")){
  //     if($("#list").children().length != 0){
  //       $("#list").useAnimateCSS("zoomOut");
  //       setTimeout(function() {
  //         $("#list").children().each(function(){
  //           $(this).off();
  //         });
  //         $("#list").html("");
  //         $("#list").removeAnimateCSS("zoomOut")
  //       },500);
  //     }
  //   }
  // });
  //Modal and Themes
  //Modal

  $( "#settings-btn" ).click(function() {
  	$("#modals").show();
	  $("#settings-modal").show();
	  $("#settings-modal").useAnimateCSS("zoomIn");
	});

  $( "#clear2-btn" ).click(function() {
	  $("#settings-modal").hide();
	  $("#modals").hide();
	});
//Theme
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
      onItemRemove($(".each-list.selected").children());
      if($(".each-list.selected").children().length != 0){
        $(".each-list.selected").useAnimateCSS("zoomOut");
        setTimeout(function() {
          $(".each-list.selected").children().each(function(){
            $(this).off();
            $(".text-editor-btn").off("click");
          });
          $(".each-list.selected").html("");
          $(".each-list.selected").removeAnimateCSS("zoomOut");
        },500);
      }
    });
  });
});
