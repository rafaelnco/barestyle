(this["webpackJsonpbarestyle-example"]=this["webpackJsonpbarestyle-example"]||[]).push([[0],{11:function(e,t,n){e.exports=n(17)},16:function(e,t,n){},17:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),o=n(7),s=n.n(o),i=n(1),c=n(10),u=n(8),l=n(5),h=n(9),m=n.n(h),f=(n(16),n(4)),g=n(2),p=f.c.values,v=Object(f.e)({nominators:[g.g,g.b],types:{unit:function(e){return"".concat(2*e,"rem")}}}),b=function(e){return e},d=function(e){var t=e.pressed,n=e.hovered,r=e.animating;return a.a.createElement(b,{"oneHalf-scale":t,"twoAHalf-skew":r,"two-scale":n,"one-apex":n||t,"lightest-filled-shadow":!t,"lightest-link-shadow":t}).props};function O(){var e=function(e,t){var n=Object(r.useState)({}),a=Object(l.a)(n,2),o=a[0],s=a[1],i=(o.pressed,o.hovered),c=o.animating;return{state:o,props:{pressIn:function(){return s({animating:c,pressed:!0})},pressOut:function(){return s({animating:!c,hovered:i})},hoverIn:function(){return s({animating:!c,hovered:!0})},hoverOut:function(){return s({animating:!c})}}}}(),t=e.state,n=e.props;return Object.assign({},d(t),n)}function j(e){var t=e.hoverIn,n=e.hoverOut,a=e.pressIn,o=e.pressOut,s=Object(r.useState)(!1),i=Object(l.a)(s,2),c=i[0],u=i[1];return{onMouseEnter:function(){t&&t()},onMouseDown:function(){a&&a(),u(!0)},onMouseUp:function(){c&&o&&o(),u(!1)},onMouseLeave:function(){c&&u(!1),n&&n()}}}j.consumer=["hoverIn","hoverOut","pressIn","pressOut"];var k=function(e){return{hook:e}},E=Object(f.e)({types:{hook:k},values:{hooks:{mouse:k(j),animate:k(O)}},rules:{hooks:{use:["action"]}},variants:function(e){var t=e.rules,n=e.values;return{hooks:[t.hooks,n.hooks]}},transformers:function(e){return Object(u.a)(e),[{type:"properties",parameters:["hook"],transformation:function(e){return{hook:e.hook}}}]}});console.log(E,v);var w=Object(f.b)(v,E),y=function(e){var t=e.Tag,n=void 0===t?"div":t,r=Object(c.a)(e,["Tag"]);return a.a.createElement(n,Object(f.a)(w,r))},x=function(e){return a.a.createElement(y,Object.assign({"three-width":!0,"three-height":!0},e))},I=function(e){return a.a.createElement(x,Object.assign({"use-mouse":!0,"lightest-round":!0,"lightest-margin":!0},O(),e))};I.Primary=function(e){return a.a.createElement(I,Object.assign({"double-grow":!0,"lightest-link-border-bottom":!0,"lightest-alert-border-left":!0},e))};var M=function(e){return a.a.createElement(y,Object.assign({Tag:"img"},e))},S=function(e){return a.a.createElement(y,Object.assign({Tag:"p"},e))},T=function(e){return a.a.createElement(y,Object.assign({flex:!0},e))},B=[p.dimension,p.pallete,{background:["backgroundColor"]}],C=Object(f.d)({constraints:B}),H=Object.keys(p.pallete),J=function(e){return H.length*e};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(a.a.createElement((function(){return a.a.createElement(T,{vertical:!0},a.a.createElement(T,{"lightest-filled-shadow":!0,"justify-start":!0},a.a.createElement(T,{"five-height":!0},a.a.createElement(M,{src:m.a,"full-height":!0})),a.a.createElement(T,null,a.a.createElement(S,{"primary-foreground":!0,"heavy-text":!0},"Bare Style"))),a.a.createElement(T,{wrap:!0,horizontal:!0,"justify-center":!0,"flow-vertical":!0},H.map((function(e,t){return a.a.createElement(T,{key:String.fromCharCode(65+t)},function(e){return Object.keys(C).slice(J(e),J(e+1))}(t).map((function(e){return a.a.createElement(I.Primary,Object.assign({key:e},Object(i.a)({},e,!0)))})))}))))}),null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},9:function(e,t,n){e.exports=n.p+"static/media/logo.881e786c.svg"}},[[11,1,2]]]);
//# sourceMappingURL=main.b1c32002.chunk.js.map