!function(e, t, a) {
    function r() {
      for (var e = 0; e < n.length; e++) {
        if (n[e].alpha <= 0) {
          t.body.removeChild(n[e].el);
          n.splice(e, 1);
        } else {
          n[e].y--;
          n[e].scale += 0.004;
          n[e].alpha -= 0.013;
          n[e].el.style.cssText = "left:" + n[e].x + "px;top:" + n[e].y + "px;opacity:" + n[e].alpha + ";transform:scale(" + n[e].scale + "," + n[e].scale + ") rotate(45deg);background:" + n[e].color + ";z-index:99999";
        }
      }
      requestAnimationFrame(r);
    }
  
    var n = [];
  
    // Polyfill for requestAnimationFrame()
    e.requestAnimationFrame = e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame || function(e) {
      setTimeout(e, 1e3 / 60);
    };
  
    // Define the CSS style for the heart element
    (function(e) {
      var a = t.createElement("style");
      a.type = "text/css";
      try {
        a.appendChild(t.createTextNode(e));
      } catch (t) {
        a.styleSheet.cssText = e;
      }
      t.getElementsByTagName("head")[0].appendChild(a);
    })(".heart{width: 10px;height: 10px;position: fixed;background: #f00;transform: rotate(45deg);-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);}.heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%;position: fixed;}.heart:after{top: -5px;}.heart:before{left: -5px;}");
  
    // Listen for click event and create a new heart element
    (function() {
      var a = typeof e.onclick == "function" && e.onclick;
      e.onclick = function(e) {
        a && a();
        (function(e) {
          var a = t.createElement("div");
          a.className = "heart";
          n.push({
            el: a,
            x: e.clientX - 5,
            y: e.clientY - 5,
            scale: 1,
            alpha: 1,
            color: "rgb(" + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + ")"
          });
          t.body.appendChild(a);
        })(e);
      };
    })();
  
    // Start the animation
    r();
  }(window, document);





// //星星效果
// !function(e, t, a) {
//     function r() {
//       for (var e = 0; e < n.length; e++) {
//         if (n[e].alpha <= 0) {
//           t.body.removeChild(n[e].el);
//           n.splice(e, 1);
//         } else {
//           n[e].y--;
//           n[e].scale += 0.004;
//           n[e].alpha -= 0.013;
//           n[e].el.style.cssText = "left:" + n[e].x + "px;top:" + n[e].y + "px;opacity:" + n[e].alpha + ";transform:scale(" + n[e].scale + "," + n[e].scale + ") rotate(" + n[e].angle + "deg);background:" + n[e].color + ";z-index:99999";
//         }
//       }
//       requestAnimationFrame(r);
//     }
  
//     var n = [];
  
//     // Polyfill for requestAnimationFrame()
//     e.requestAnimationFrame = e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame || function(e) {
//       setTimeout(e, 1e3 / 60);
//     };
  
//     // Define the CSS style for the star element
//     (function(e) {
//       var a = t.createElement("style");
//       a.type = "text/css";
//       try {
//         a.appendChild(t.createTextNode(e));
//       } catch (t) {
//         a.styleSheet.cssText = e;
//       }
//       t.getElementsByTagName("head")[0].appendChild(a);
//     })(".star{width: 0;height: 0;border: 10px solid transparent;border-right: 14px solid #f00;position: fixed;transform: rotate(35deg) scale(0.5);}.star:before{content: '';width: 0;height: 0;border: 10px solid transparent;border-right: 14px solid #f00;position: absolute;top: -24px;left: -10px;transform: rotate(-70deg) scale(0.5)}");
    
//     // Listen for click event and create a new star element
//     (function() {
//       var a = typeof e.onclick == "function" && e.onclick;
//       e.onclick = function(e) {
//         a && a();
//         (function(e) {
//           var a = t.createElement("div");
//           a.className = "star";
//           n.push({
//             el: a,
//             x: e.clientX - 5,
//             y: e.clientY - 5,
//             scale: 1,
//             alpha: 1,
//             color: "rgb(" + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + ")",
//             angle: ~~(360 * Math.random())
//           });
//           t.body.appendChild(a);
//         })(e);
//       };
//     })();
  
//     // Start the animation
//     r();
//   }(window, document);