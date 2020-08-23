---
title: github와 gatsby로 블로그 운영하기2:기능 추가하기
date: "2020-02-16 13:30:53.297331"
template: "post"
draft: false
slug: "/posts/github와_gatsby로_블로그_운영하기2/"
category: "etc"
tags:
  - "react"
  - "github"
  - "gatsby"
  - "블로그"
  - "blog"
  - "disqus"
  - "netlify"
description: "gatsby를 이용하여 블로그 운영시에 댓글(disqus) 및 배포(netlify)에 대해서 간단히 내용을 추가했습니다."
---


## **Intro**

바로 전 내용인 [github와 gatsby로 블로그 운영하기](https://third9.github.io/posts/github와_gatsby로_블로그_운영하기/)에서 다루었던 내용에 이어서 댓글 기능과 배포에 관련한 내용을 추가합니다.

## **댓글 기능 구현 연동**

### #DISQUS **소개**

블로그를 운영한다면 필수는 아니지만 댓글 기능도 있으면 좋습니다. 대중적으로 많이 사용되는 naver, tistory의 블로그 서비스에서는 이러한 댓글 기능을 기본으로 지원합니다. 하지만 gatsby와 같은 정적 페이지 서비스와 같은 경우는 이러한 기능이 존재하지 않습니다. 이러한 정적 페이지 서비스에서도 댓글 기능을 지원해주는 외부 서비스가 DISQUS입니다.

### #DISQUS **계정 생성**

DISQUS를 사용하기 위해서는 필수적으로 계정을 생성해야 합니다. [DISQUS](https://disqus.com) 사이트로 이동하여, `Get Started` 를 선택하여 새로운 계정을 생성해 줍니다.
![](/media/github와_gatsby로_블로그_운영하기2/1.png)

계정을 생성할때 `Website URL`에는 서비스하고자 하는 블로그의 주소를 입력하고, `Shortname`에는 DISQUS를 gatsby와 연동할 경우에 사용할 nickname(ID)를 입력합니다. `Shortname` 의 경우에는unique 한 값으로 한번 선택하면 변경할 수 없기에 잘 선택해야 합니다. 

### #**gatsby에** DISQUS **연동**

위의 작업까지 완료하였다면, 그 다음 작업은 너무 간단합니다. 물론 이건 gatsby 환경에 `lumen Template`를 적용하였기에 가능한 일입니다. 직접 구현한다면 관련 모듈부터 그 외 디테일한 기능까지 모두 신경을 써야 했을 겁니다.

gatsby에 DISQUS를 붙이는 방법은 [github와 gatsby로 블로그 운영하기](https://third9.github.io/posts/github와_gatsby로_블로그_운영하기/)에서 소개했던 `config.js` 파일에 DISQUS의 `Shortname`을 추가하면 됩니다.
```js {numberLines}
// config.js
module.exports = {
  ...
  copyright: '© All rights reserved.',
  disqusShortname: 'MyDISQUS-Shortname', // 비어있던 해당 위치에 Shortname을 입력
  postsPerPage: 4,
  ...
}
```

위의 모습처럼 `config.js` 의 `module.exports` 의 안에 `disqusShortname` 속성에(없다면 만들어서) shortname을 입력하면 자동으로 gatsby에서 반영되어, 작동이 수행됩니다.


## **배포 서비스 연동**

### #**netlify 서비스 소개**

gatsby를 이용하여 블로그를 운영함에 있어서 배포하는 방법은 여러가지가 있지만, 가장 대표적인 것이 현재 운영중인 github의 page를 이용하는 방식이고 두번째는 최근에 많이 뜨고 있는 netlify라는 서비스를 이용하는 것입니다.
netlify를 이용하면, 빌드 과정을 직접 할 필요 없이 바로 웹 페이지에 배포가 가능합니다.
github의 page를 이용하는경우 `gatsby build` 를 이용하여 build 한 뒤에 branch에 Push해야하는 작업을 직접 진행해야 합니다. 물론 이러한 작업이 번거로워서 보통 `package.json`에 아래와 같이 script를 추가하여 사용합니다.
```json
# package.json
{
  ... 중략
  ...
  "main": "n/a",
  "scripts": {
    ...중략
    ...
    "deploy": "yarn run clean && gatsby build --prefix-paths && gh-pages -d public -b master",
    ...중략
    ...
  },
  ...중략
  ...
}
```
위와 같이  `deploy` script 축약어를 만들어 둔 뒤에, `yarn run deploy`를 실행하면 build작업과 github branch에 올리는 작업까지 모두 한번에 수행이 가능합니다. netlify를 이용한다면 이러한 작업들을 직접 할 필요없이, github의 정해진 branch에 push를 함과 동시에 netlify에서 자동으로 build 진행을 수행한 뒤에 정해진 domain에 서비스를 배포해주게 됩니다.

### #**netlify의 github repo 연동**

> 해당 서비스를 사용하기 위해서는 당연히 회원가입을 해야됩니다. 회원가입 방법 까지는 별도로 여기서 다루지는 않습니다.

계정을 생성한 뒤에 Sites 화면을 보면 아래와 같은 화면을 취하고 있습니다.(저는 이미 site를 하나 등록해 두었기에 아래와 같이 존재하는 domain이 있습니다.)
![](/media/github와_gatsby로_블로그_운영하기2/2.png)
위의 화면에서 `New site from Git`을 선택하면 아래와 같이 Wizard 형식으로 연결하고자 하는 Git환경을 선택하고 설정 할 수 있습니다.
![](/media/github와_gatsby로_블로그_운영하기2/3.png)

자신이 사용하는 Git 저장소를 선택한 뒤에 해당 Git 저장소의 인증을 거친 후 Repo와 branch를 선택하여 설정을 마무리 하면 됩니다.
>netlify 설정에 대한 부분을 좀더 자세히 알고 싶다면, 해당 블로그의 글을 추천합니다. [netlify로 정적 사이트 배포하기](https://blog.outsider.ne.kr/1417)

## 다음에 시간이 된다면...
google analystic 연동과 gatsby의 template 코드를 customize하여 문서에서 Head 목록이 나오게 하는 내용을 추가하겠습니다.
