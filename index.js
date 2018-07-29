$(document).ready(function(){
  //Dropdown Toggle
  var isListDropdownOn = false;
  $("#list-select").click(function(e){
    toggleListDropdown();
  });
  //Trigger Dropdown Chanage
  $(".list-select-option").each(function(){
    $(this).click(function(){
      if(!($(".list-select-option.selected").is("#list-1"))){
        $(".list-select-option.selected").appendTo("#list-select-not-selected").removeClass("selected");
      }
      $(this).prependTo("#visible-list-select").addClass("selected");
      addListByFiller();
    });
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
    let listid = $(".list-select-option").length;
    for(let j = 1; j <= $(".list-select-option").length; j++){
      if(!$("#list"+j).length){
        listid = j;
      }
    }
    $("#list-select-not-selected").append("\
    <div id='list"+listid+"' class='list-select-option'>\
      <span class='list-select-title'>New List</span>\
      <span id='list-close"+listid+"' class='list-close'><i class='material-icons'>close</i></span>\
    </div>");
    addListByFiller();
    $("#list"+listid).hide();
    if($(".list-select-option").length >= 3){
      $("#list"+listid).slideDown();
    }else{
      $("#list"+listid).fadeIn();
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
            $("#list-select-not-selected > .list-select-option").first().prependTo("#visible-list-select").addClass("selected");
            $("#list"+listid).remove();
            addListByFiller();
          });
        }
        console.log($("#list-select-not-selected").children().length);
        console.log($("#visible-list-select").children().length);
        console.log(($("#list-select-not-selected").children().length != 0 && $("#visible-list-select").children().length >= 2));
      });
    });
    if(!isListDropdownOn){
      toggleListDropdown();
    }
    $("#list"+listid).click(function(){
      if(!($(".list-select-option.selected").is("#list-1"))){
        $(".list-select-option.selected").appendTo("#list-select-not-selected").removeClass("selected");
      }
      $(this).prependTo("#visible-list-select").addClass("selected");
      addListByFiller();
    });
  });
  $("#list-1").click(function(e){
    e.stopPropagation();
    $("#add-list-btn").trigger("click");
  });
  $("#list").sortable({
    handle:".item-move",
    axis: "y"
  });
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
    $("#list").append("\
      <div id='item"+itemid+"' class='item'>\
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
    } else {
    }
    });
    //USELESS
    $("#color-prompt").change(function(e){
      if(thisBtn.attr("data-format") == "background" || thisBtn.attr("data-exec")=="foreColor"){
        thisBtn.attr("style","color:"+$(this).val()+";");
        if(thisBtn.attr("data-exec") == "foreColor"){
          console.log("Color changed")
          document.execCommand(thisBtn.attr("data-exec"),false,$(this).val());
        }else if(thisBtn.attr("data-format") === "background"){
          console.log("background changed")
          focusedContentEditable.parent().css("background-color",$(this).val());
        }
      }
    });
    $("#item-close"+itemid).click(function(){
      $("#item"+itemid).addClass("zoomOut animated");
      $(".text-editor-btn").off("click.item"+itemid);
      setTimeout(function() {
        $("#item"+itemid).off();
        $("#item-"+itemid).sortable("disabled");
        $("#item"+itemid).remove();
        removeListWhiteSpace();
      },500);
    });
    $("#item"+itemid+">.item-span").click(function(){
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
      if($("#list").children().length != 0){
        $("#list").useAnimateCSS("zoomOut");
        setTimeout(function() {
          $("#list").children().each(function(){
            $(this).off();
            $(".text-editor-btn").off("click");
          });
          $("#list").html("");
          $("#list").removeAnimateCSS("zoomOut");
        },500);
      }
    });
  });
});
