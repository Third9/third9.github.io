(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{"/d1K":function(e,t,a){"use strict";a.d(t,"a",(function(){return L}));var n=a("q1tI"),l=a.n(n),i=(a("pJf4"),a("Wbzz")),c=a("iSRb"),r=a.n(c),o=function(e){var t=e.author,a=e.isIndex;return l.a.createElement("div",{className:r.a.author},l.a.createElement(i.Link,{to:"/"}),!0===a?l.a.createElement("h1",{className:r.a.author__title},l.a.createElement(i.Link,{className:r.a["author__title-link"],to:"/"},t.name)):l.a.createElement("h2",{className:r.a.author__title},l.a.createElement(i.Link,{className:r.a["author__title-link"],to:"/"},t.name)),l.a.createElement("p",{className:r.a.author__subtitle},t.bio))},s=(a("rzGZ"),a("Dq+y"),a("8npG"),a("Ggvi"),a("7Qib")),m=a("euHg"),u=a.n(m),_=function(e){var t=e.name,a=e.icon;return l.a.createElement("svg",{className:u.a.icon,viewBox:a.viewBox},l.a.createElement("title",null,t),l.a.createElement("path",{d:a.path}))},d=a("aU/I"),g=a.n(d),p=function(e){var t=e.contacts;return l.a.createElement("div",{className:g.a.contacts},l.a.createElement("ul",{className:g.a.contacts__list},Object.keys(t).map((function(e){return t[e]?l.a.createElement("li",{className:g.a["contacts__list-item"],key:e},l.a.createElement("a",{className:g.a["contacts__list-item-link"],href:Object(s.a)(e,t[e]),rel:"noopener noreferrer",target:"_blank"},l.a.createElement(_,{name:e,icon:Object(s.b)(e)}))):null}))))},b=a("Nrk+"),h=a.n(b),E=function(e){var t=e.copyright;return l.a.createElement("div",{className:h.a.copyright},t)},f=a("je8k"),v=a.n(f),k=function(e){var t=e.menu;return l.a.createElement("nav",{className:v.a.menu},l.a.createElement("ul",{className:v.a.menu__list},t.map((function(e){return l.a.createElement("li",{className:v.a["menu__list-item"],key:e.path},l.a.createElement(i.Link,{to:e.path,className:v.a["menu__list-item-link"],activeClassName:v.a["menu__list-item-link--active"]},e.label))}))))},N=a("N1om"),y=a.n(N),x=a("Fdal"),I=a.n(x),j=function(e){var t=e.tags;return l.a.createElement("nav",{className:I.a.tag},t.map((function(e,t){return l.a.createElement(i.Link,{to:"/tag/"+y()(e.fieldValue)+"/",className:I.a.tag__button,activeClassName:I.a["tag__item-link--active"]},e.fieldValue,"(",e.totalCount,")")})))},C=a("SySy"),O=a.n(C),w=a("gGy4"),L=function(e){var t=e.isIndex,a=Object(w.b)(),n=a.author,i=a.copyright,c=a.menu,r=Object(w.c)();return l.a.createElement("div",{className:O.a.sidebar},l.a.createElement("div",{className:O.a.sidebar__inner},l.a.createElement(o,{author:n,isIndex:t}),l.a.createElement(k,{menu:c}),l.a.createElement(j,{tags:r}),l.a.createElement(p,{contacts:n.contacts}),l.a.createElement(E,{copyright:i})))}},AN6v:function(e,t,a){"use strict";a.r(t);var n=a("q1tI"),l=a.n(n),i=a("Wbzz"),c=a("N1om"),r=a.n(c),o=a("Zttt"),s=a("/d1K"),m=a("RXmK"),u=a("gGy4");t.default=function(){var e=Object(u.b)(),t=e.title,a=e.subtitle,n=Object(u.c)();return l.a.createElement(o.a,{title:"Tags - "+t,description:a},l.a.createElement(s.a,null),l.a.createElement(m.a,{title:"Tags"},l.a.createElement("ul",null,n.map((function(e){return l.a.createElement("li",{key:e.fieldValue},l.a.createElement(i.Link,{to:"/tag/"+r()(e.fieldValue)+"/"},e.fieldValue," (",e.totalCount,")"))})))))}},Fdal:function(e,t,a){e.exports={tag:"Tags-module--tag--1g5Pr",tag__button:"Tags-module--tag__button--1uIUF",tag__list:"Tags-module--tag__list--AL6lG","tag__list-item":"Tags-module--tag__list-item--1839L","tag__list-item-link":"Tags-module--tag__list-item-link--Thjy7","tag__list-item-link--active":"Tags-module--tag__list-item-link--active--1HsLz"}},"Nrk+":function(e,t,a){e.exports={copyright:"Copyright-module--copyright--1ariN"}},RBgx:function(e,t,a){e.exports={page:"Page-module--page--2nMky",page__inner:"Page-module--page__inner--2M_vz",page__title:"Page-module--page__title--GPD8L",page__body:"Page-module--page__body--Ic6i6"}},RXmK:function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var n=a("q1tI"),l=a.n(n),i=a("RBgx"),c=a.n(i),r=function(e){var t=e.title,a=e.children,i=Object(n.useRef)();return Object(n.useEffect)((function(){i.current.scrollIntoView()})),l.a.createElement("div",{ref:i,className:c.a.page},l.a.createElement("div",{className:c.a.page__inner},t&&l.a.createElement("h1",{className:c.a.page__title},t),l.a.createElement("div",{className:c.a.page__body},a)))}},SySy:function(e,t,a){e.exports={sidebar:"Sidebar-module--sidebar--X4z2p",sidebar__inner:"Sidebar-module--sidebar__inner--Jdc5s"}},"aU/I":function(e,t,a){e.exports={contacts:"Contacts-module--contacts--1rGd1",contacts__list:"Contacts-module--contacts__list--3OgdW","contacts__list-item":"Contacts-module--contacts__list-item--16p9q","contacts__list-item-link":"Contacts-module--contacts__list-item-link--2MIDn"}},euHg:function(e,t,a){e.exports={icon:"Icon-module--icon--Gpyvw"}},iSRb:function(e,t,a){e.exports={author__photo:"Author-module--author__photo--36xCH",author__title:"Author-module--author__title--2CaTb","author__title-link":"Author-module--author__title-link--Yrism",author__subtitle:"Author-module--author__subtitle--cAaEB"}},je8k:function(e,t,a){e.exports={menu:"Menu-module--menu--Efbin",menu__list:"Menu-module--menu__list--31Zeo","menu__list-item":"Menu-module--menu__list-item--1lJ6B","menu__list-item-link":"Menu-module--menu__list-item-link--10Ush","menu__list-item-link--active":"Menu-module--menu__list-item-link--active--2CbUO"}}}]);
//# sourceMappingURL=component---src-templates-tags-list-template-js-9d425039fd3f664bd6f1.js.map