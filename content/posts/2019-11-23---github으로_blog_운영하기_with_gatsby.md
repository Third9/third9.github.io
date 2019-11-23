---
title: github 블로그 운영하기 with gatsby
date: "2019-11-23 13:30:53.297331"
template: "post"
draft: false
slug: "/posts/github_블로그_운영하기_with_gatsby/"
category: "etc"
tags:
  - "react"
  - "github"
  - "gatsby"
  - "블로그"
  - "blog"
description: "정적 사이트 생성기인 gatsby를 이용하여 github에 블로그 생성 및 posting 하는법을 다룹니다."
---


## intro

이전부터 github으로 블로그를 하기위해서 생각만 하고 있었는데 실제로 실천할때가 되니, react를 이용한 서비스까지 나왔네요. 개인적으로 react를 선호하기에 react 기반의 `gatsby`를 이용하였습니다.

우선 gatsby를 비롯한 다른 대부분의 정적 사이트 생성기는 node를 기반으로 하기에, 해당 pc 환경에 node.js 및 사용하려는 환경에 맞추어 기본 설치가 필요합니다. 이러한 부분은 여기서는 다루지 않겠습니다.

저는 mac os 환경에서 진행을 하였고, 기본 환경이 다 이루어져있다는 가정하에 진행을 하겠습니다.

우선 gatsby의 이용을 위해서는 gatsby-cli의 설치가 필수이며, 추후 작성된 글의 build 및 deploy를 위해서 yarn 패키지를 같이 설치해 주는게 좋습니다. yarn 패키지 서비스 설치에 대해서는 여기서 다루지 않습니다.



## gatsby 설치

> gatsby-cli 설치

```shell
$ npm install -g gatsby-cli # -g 옵션을 주어야 전역으로 설치되어 사용에 불편함이 없습니다.
```



또한 다른 정적 사이트 생성기와 마찬가지로 gatsby도 다양한 template을 지원하는데 저는 그중에서 [lumen](https://github.com/alxshelepenok/gatsby-starter-lumen)을 사용하기로 했습니다. lumen 말고도 다양한 template 들이 있으니 확인하고픈 분은 [여기](https://www.gatsbyjs.org/starters/?v=2) 들어가서 확인하시면 됩니다.

gatsby의 설치가 완료되었다면 이제 gatsby-cli를 이용해서 블로그의 생성 및 서비스가 가능합니다.

gatsby `new`명령어를 통해서 새로운 블로그의 생성이 가능합니다. 여기서는 위에 말한 `lumen template`을 이용해서 진행하겠습니다.

```shell
# gatsby new [blog-title] [gatsby template url]
$ gatsby new my-blog https://github.com/alxshelepenok/gatsby-starter-lumen
```



설치가 정상적으로 되었다면 설치 완료이후에 아래와 같은 내용이 나옵니다.

```shell
Your new Gatsby site has been successfully bootstrapped. Start developing it by
running:
  $ cd my-blog
  $ gatsby develop
```

위의 내용대로 `my-blog`폴더로 이동하면 블로그 이용을 위한 기본적인 파일들이 생성되어있습니다. 생성보다는 template url의 내용을 다운로드 받습니다.

생성되어진 blog 경로로 이동하여, `gatsby develop`을 수행하여 정상적으로 동작한다면 `localhost:8000`에서 기본 template환경의 사이트를 확인 할 수 있으며 들어가보면 수염을 산타처럼 풍성히 기른 아저씨가 있는 blog가 나올겁니다.



## Blog 설정

위의 작업까지 정상적으로 진행하였다면 blog 이용에 아무 문제가 없습니다. 기본 상태에서 그대로 블로그 글 작성하고 올리고 하면 됩니다. 다만, 내 블로그는 수염 기른 아저씨의 블로그처럼 보이겠지요...

내 블로그를 만들고 싶은것이니, 약간의 설정 및 template를 수정해보죠, 위의 글을 순서대로 진행하였다면 현재 `my-blog`폴더 내에 있을겁니다. 

lumen template 환경에서의 블로그 설정 정보들은 대부분 `config.js`파일 내에 있습니다. 여기서 정보를 수정하면 기본적으로 반영이 됩니다. 내용들은 필요에 따라서 아래와 같이 수정해줍니다.

우선 blog의 기본적인 제목 및 home 링크 등등 필수적인 부분을 수정해 줍니다.

> config.js 수정

```js
'use strict';

module.exports = {
  url: 'my-blog의 url link', // home url 주소입니다.
  pathPrefix: '/', // root 경로
  title: 'My Blog', // blog의 title 입니다.
  subtitle: 'My blog subtitle', // blog의 subtitle에 나오는 정보입니다.
  copyright: '© All rights reserved.', // 소유권 정보이니 내 blog 라면 그대로 둡시다
  disqusShortname: '', // 다음에 설명할게요
  postsPerPage: 4, // 한 화면에 보여질 post 갯수
  googleAnalyticsId: '', // 처음에 값이 들어있는데 지워줍니다. 다음에 설명할게요
  
  ...
  중략
  ...
  
  // 여기 아래부터는 home 화면의 좌측에 표시되는 프로필 정보들입니다.
  author: {
    name: 'my-blog', // 이름정보입니다.
    photo: '/photo.jpg', // profill 이미지 파일명
    bio: 'by-blog bio', // 프로필 간략 정보
    contacts: { // home 화면의 좌측 하단에 표시되는 icon들 정보입니다. 빈값으로 두면 화면상에 표시되지 않습니다.
      email: 'my-blog@email.net',
      facebook: '',
      telegram: '',
      twitter: '',
      github: 'my-github-id',
      rss: '',
      vkontakte: '',
      linkedin: '',
      instagram: '',
      line: '',
      gitlab: '',
      weibo: ''
    }
  }
  }
};
```

가장 기본적인 부분들부터 먼저 수정해 줍니다.

프로필 image를 다른것으로 수정하려면, 원하는 이미지파일의 이름을 photo로 변경한뒤에, `static` 폴더에 추가하면 됩니다. 아니면, 설정파일의 photo의 파일명을 바꿔도 됩니다.



Blog 사이트에서 보이는 Article, about me, contact me 와 같은 내용들은 `config.js`설정에서 

```js
... 중략 ...

menu: [
    {
      label: 'Articles', 
      path: '/'
    },
    {
      label: 'About me',
      path: '/pages/about'
    },
    {
      label: 'Contact me',
      path: '/pages/contacts'
    }
  ],
... 중략 ...
```

위의 메뉴 정보를 수정하는것으로 변경이 가능합니다. `articles`를 제외한 about, contacts 등의 정보는 `content/pages`위치에 존재합니다. 파일들을 수정하면 내용도 수정이 가능합니다.



## Blog 글쓰기

blog에 올리고 싶은 글들은 `content/posts`경로에 등록하면 됩니다.  글의 작성은 기존에 example로 존재하는 내용 및 파일명을 참조하여 작성하면 됩니다.

> 기본 양식

```markdown
---
title: 제목 // 제목을 작성합니다. "를 빼고 작성합니다.
date: "YYYY-MM-DD hh:mm:sec" // 시간을 입력하는 일반적인 datetime format으로 작성하며, "로 감싸야 합니다.
template: "post"
draft: false // 해당 타입을 true로 변경하면 blog에 포스팅 되어있지만 글이 보이지 않습니다.
slug: "/posts/제목/" // url link에서 보여질 주소를 나타냅니다.
category: "Develop" // category를 구분합니다.
tags: // 아래에 tag들을 등록합니다.
  - "tag1"
  - "tag2"
description: "목록에서 보일 내용" // 글의 내용이 아닌 home의 목록에서 보여지는 내용입니다.
---

이하 post 내용 작성
```

위의 `---`로 싸여진 내용은 필수정보입니다. 빠지면 정상적으로 글이 보이지 않을수도 있고, 해당 정보에서 "를 잘 확인해야 합니다. "로 싸여진 내용이 있고, 그렇지 않은 내용도 있습니다.



여기까지 진행되었다면, gatsby 글쓰기의 기본적인 부분은 다 되었습니다. 이제 글을 올리기만 하면됩니다.



## Blog 배포

이제 만들어진 글을 다른사람들도 볼 수있도록 배포해야 하는데 일반적인 github.io를 통하여 올리는 법과 netlify라는 서비스를 이용햇 올리는 방법이 있다. 우선 여기서는 github.io에 올리는 내용을 쓰고, netlify를 이용하는 방법은 따로 올리겠습니다.



github에 올리려면, 우선 해당 git repo가 만들어져 있어야합니다. github 사이트에 들어가서 새로운 repository를 만들때 명칭을 `[blog-title].github.io`형태로 만들고 아래의 내용을 진행합니다. 다만 github.io 도메인을 사용하여 blog를 사용하려면 해당 파일들이 master 브랜치에 등록되어 있어야 하는 걸로 알고 있습니다. 그래서 블로그 코드 원본을 유지하기 위해서 별도의 branch를 생성했습니다. 명칭은 자유롭게 해도 되는데 여기선 `blog-source`로 했습니다

```shell
$ git init // git 환경을 만듭니다.
$ git checkout -b blog-source // blog-source 브랜치 생성
$ git add . // blog 파일들 추가
$ git commit -m "블로그 처음 셋팅" // blog 파일들 등록
$ git remote add origin https://github.com/[my-id]/[blog-title].github.io // posting 하고자 하는 github repo url 등록
$ git push -u origin blog-source // blog-source 브랜치를 원격에도 동일하게 upload
```

위의 작업을 한다고 글이 보이진 않습니다. 단지 내가 쓴 blog 원본 데이터를 보존 하기 위한 거죠,

이제 `package.json`파일을 수정합니다. 해당 파일은 node.js 를 사용하는 서비스들에 한해서 package 정보 및 실행 명령어를 선언하고 있습니다.

해당 파일을 열어서 보면 아래와 같은 `script` 쪽 내용이 보일 겁니다.

```json
'''중략'''

"scripts": {
    "develop": "yarn run clean && gatsby develop",
    "build": "yarn run clean && gatsby build",
    "deploy": "yarn run clean && gatsby build --prefix-paths && gh-pages -d public",
    "clean": "rimraf .cache public",
    "flow": "flow",
    "lint:js": "eslint --cache --ext .js,.jsx .",
    "lint:scss": "stylelint \"src/**/*.scss\"",
    "lint": "concurrently \"yarn run lint:js\" \"yarn run lint:scss\" \"yarn flow\"",
    "test": "jest --config ./jest/jest-config.js",
    "test:coverage": "jest --coverage --config ./jest/jest-config.js",
    "test:watch": "jest --watch --config ./jest/jest-config.js"
  },
"repository": "https://github.com/[my-id]/[blog-title].github.io", // 본인의 repo 주소로 변경합니다.

'''중략'''
```

여기서 우리는 `"deploy": "yarn run clean && gatsby build --prefix-paths && gh-pages -d public",` 내용을 수정합니다. text의 맨뒤에 `-b master`를 붙여서 `"deploy": "yarn run clean && gatsby build --prefix-paths && gh-pages -d public -b master"` 요렇게 바꿉니다.

그럼 이제 deploy 명령을 수행하면 master 브랜치에 글이 등록됩니다. 글을 등록하기전에 먼저 블로그가 정상적으로 보이는지 확인을 합니다.

```shell
$ yarn run build # 정적 사이트로 보일 수 있도록 build 하는 과정
$ gatsby serve # local 서버 실행
```

를 통해서 [localhost:9000](localhost:9000) 로 접근하면 확인이 가능합니다. local에서 확인했을때도 아무런 문제가 없다면 이제 실제 사이트에 배포합니다.

```shell
$ npm run deploy
or
$ yarn run deploy
```

위 처럼 명령어를 수행하면, gatsby의 build 작업과 함께 해당 github의 master 브랜치에 upload가 되고, `[blog-title].github.io`에 접속하면 블로그가 보이는 걸 확인할 수 있습니다.



## 다음에 다룰 내용들

이렇게 블로그를 등록했지만, 일반 블로그에 비해서 불편한 점들이 몇가지 있는데 그부분을 다음에 작성하는 글에서 다루겠습니다.

일단 블로그를 만들었는데... 댓글을 달수가 없어요... disqus 라는 서비스를 이용하면 가능합니다. 현재 또는 내 블로그에 사람들이 들어오고는 있는지 알 수 가 없어요... googleAnalystic 을 이용하면 됩니다. 글을 github 말고 다른곳에 좀더 편하게 올릴 수 없나요? netlify라는 서비스를 사용하면됩니다. 모두 다음에 관련 내용을 등록하겠습니다.
