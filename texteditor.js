$(document).ready(function(){
  $("#rich-text-editor").attr("style","visibility:hidden;");
  $("html").click(function(e){
    if(!($(e.target).attr("contenteditable")) && !($("[contenteditable=true]").has($(e.target)).length) && !($(e.target).is($(".text-editor-btn"))) && !($(e.target).is($(".material-icons")))){
      $("#rich-text-editor").attr("style","visibility:hidden;");
    }
  });
});
