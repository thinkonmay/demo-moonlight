$(document).ready(function() {
    var tipIndex = 0;
    showTip(tipIndex);
  
    $(".prev-btn").click(function() {
      tipIndex--;
      showTip(tipIndex);
    });
  
    $(".next-btn").click(function() {
      tipIndex++;
      showTip(tipIndex);
    });
  
    function showTip(n) {
      var tips = $(".tip");
      if (n >= tips.length) {
        tipIndex = 0;
      }
      if (n < 0) {
        tipIndex = tips.length - 1;
      }
      tips.removeClass("active");
      tips.eq(tipIndex).addClass("active");
    }
  });