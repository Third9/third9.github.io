(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{"/d1K":function(e,t,a){"use strict";a.d(t,"a",(function(){return O}));var n=a("q1tI"),i=a.n(n),l=(a("pJf4"),a("Wbzz")),c=a("iSRb"),r=a.n(c),o=function(e){var t=e.author,a=e.isIndex;return i.a.createElement("div",{className:r.a.author},i.a.createElement(l.Link,{to:"/"}),!0===a?i.a.createElement("h1",{className:r.a.author__title},i.a.createElement(l.Link,{className:r.a["author__title-link"],to:"/"},t.name)):i.a.createElement("h2",{className:r.a.author__title},i.a.createElement(l.Link,{className:r.a["author__title-link"],to:"/"},t.name)),i.a.createElement("p",{className:r.a.author__subtitle},t.bio))},s=(a("rzGZ"),a("Dq+y"),a("8npG"),a("Ggvi"),a("7Qib")),m=a("euHg"),u=a.n(m),_=function(e){var t=e.name,a=e.icon;return i.a.createElement("svg",{className:u.a.icon,viewBox:a.viewBox},i.a.createElement("title",null,t),i.a.createElement("path",{d:a.path}))},d=a("aU/I"),g=a.n(d),p=function(e){var t=e.contacts;return i.a.createElement("div",{className:g.a.contacts},i.a.createElement("ul",{className:g.a.contacts__list},Object.keys(t).map((function(e){return t[e]?i.a.createElement("li",{className:g.a["contacts__list-item"],key:e},i.a.createElement("a",{className:g.a["contacts__list-item-link"],href:Object(s.a)(e,t[e]),rel:"noopener noreferrer",target:"_blank"},i.a.createElement(_,{name:e,icon:Object(s.b)(e)}))):null}))))},h=a("Nrk+"),b=a.n(h),E=function(e){var t=e.copyright;return i.a.createElement("div",{className:b.a.copyright},t)},f=a("je8k"),k=a.n(f),v=function(e){var t=e.menu;return i.a.createElement("nav",{className:k.a.menu},i.a.createElement("ul",{className:k.a.menu__list},t.map((function(e){return i.a.createElement("li",{className:k.a["menu__list-item"],key:e.path},i.a.createElement(l.Link,{to:e.path,className:k.a["menu__list-item-link"],activeClassName:k.a["menu__list-item-link--active"]},e.label))}))))},N=a("N1om"),y=a.n(N),x=a("Fdal"),I=a.n(x),w=function(e){var t=e.tags;return i.a.createElement("nav",{className:I.a.tag},t.map((function(e,t){return i.a.createElement(l.Link,{to:"/tag/"+y()(e.fieldValue)+"/",className:I.a.tag__button,activeClassName:I.a["tag__item-link--active"]},e.fieldValue,"(",e.totalCount,")")})))},j=a("SySy"),C=a.n(j),L=a("gGy4"),O=function(e){var t=e.isIndex,a=Object(L.b)(),n=a.author,l=a.copyright,c=a.menu,r=Object(L.c)();return i.a.createElement("div",{className:C.a.sidebar},i.a.createElement("div",{className:C.a.sidebar__inner},i.a.createElement(o,{author:n,isIndex:t}),i.a.createElement(v,{menu:c}),i.a.createElement(w,{tags:r}),i.a.createElement(p,{contacts:n.contacts}),i.a.createElement(E,{copyright:l})))}},"8vKr":function(e,t,a){"use strict";a.r(t),a.d(t,"query",(function(){return s}));var n=a("q1tI"),i=a.n(n),l=a("Zttt"),c=a("/d1K"),r=a("RXmK"),o=a("gGy4"),s="3804606493";t.default=function(e){var t=e.data,a=Object(o.b)(),n=a.title,s=a.subtitle,m=t.markdownRemark.html,u=t.markdownRemark.frontmatter,_=u.title,d=u.description,g=u.socialImage,p=null!==d?d:s;return i.a.createElement(l.a,{title:_+" - "+n,description:p,socialImage:g},i.a.createElement(c.a,null),i.a.createElement(r.a,{title:_},i.a.createElement("div",{dangerouslySetInnerHTML:{__html:m}})))}},Fdal:function(e,t,a){e.exports={tag:"Tags-module--tag--1g5Pr",tag__button:"Tags-module--tag__button--1uIUF",tag__list:"Tags-module--tag__list--AL6lG","tag__list-item":"Tags-module--tag__list-item--1839L","tag__list-item-link":"Tags-module--tag__list-item-link--Thjy7","tag__list-item-link--active":"Tags-module--tag__list-item-link--active--1HsLz"}},"Nrk+":function(e,t,a){e.exports={copyright:"Copyright-module--copyright--1ariN"}},RBgx:function(e,t,a){e.exports={page:"Page-module--page--2nMky",page__inner:"Page-module--page__inner--2M_vz",page__title:"Page-module--page__title--GPD8L",page__body:"Page-module--page__body--Ic6i6"}},RXmK:function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var n=a("q1tI"),i=a.n(n),l=a("RBgx"),c=a.n(l),r=function(e){var t=e.title,a=e.children,l=Object(n.useRef)();return Object(n.useEffect)((function(){l.current.scrollIntoView()})),i.a.createElement("div",{ref:l,className:c.a.page},i.a.createElement("div",{className:c.a.page__inner},t&&i.a.createElement("h1",{className:c.a.page__title},t),i.a.createElement("div",{className:c.a.page__body},a)))}},SySy:function(e,t,a){e.exports={sidebar:"Sidebar-module--sidebar--X4z2p",sidebar__inner:"Sidebar-module--sidebar__inner--Jdc5s"}},"aU/I":function(e,t,a){e.exports={contacts:"Contacts-module--contacts--1rGd1",contacts__list:"Contacts-module--contacts__list--3OgdW","contacts__list-item":"Contacts-module--contacts__list-item--16p9q","contacts__list-item-link":"Contacts-module--contacts__list-item-link--2MIDn"}},euHg:function(e,t,a){e.exports={icon:"Icon-module--icon--Gpyvw"}},iSRb:function(e,t,a){e.exports={author__photo:"Author-module--author__photo--36xCH",author__title:"Author-module--author__title--2CaTb","author__title-link":"Author-module--author__title-link--Yrism",author__subtitle:"Author-module--author__subtitle--cAaEB"}},je8k:function(e,t,a){e.exports={menu:"Menu-module--menu--Efbin",menu__list:"Menu-module--menu__list--31Zeo","menu__list-item":"Menu-module--menu__list-item--1lJ6B","menu__list-item-link":"Menu-module--menu__list-item-link--10Ush","menu__list-item-link--active":"Menu-module--menu__list-item-link--active--2CbUO"}}}]);
//# sourceMappingURL=component---src-templates-page-template-js-80147de5845d319ae215.js.map