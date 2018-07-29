(function($) {
  $.fn.useAnimateCSS = function(type) {
        this.addClass(type + " animated");
        return this;
  };
  $.fn.removeAnimateCSS = function(type) {
        this.removeClass(type + " animated");
        return this;
  };
  $.fn.selectText = function(){
   let doc = document;
   let element = this[0];
   if (doc.body.createTextRange) {
       let range = document.body.createTextRange();
       range.moveToElementText(element);
       range.select();
   } else if (window.getSelection) {
       let selection = window.getSelection();
       let range = document.createRange();
       range.selectNodeContents(element);
       selection.removeAllRanges();
       selection.addRange(range);
   }
 };

}( jQuery ));
