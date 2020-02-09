---
title: CRA(create-react-app)에서 민감정보 처리하기
date: "2020-02-02 17:19:03.538761"
template: "post"
draft: false
slug: "/posts/CRA(create-react-app)에서_민감정보_처리하기/"
category: "develop"
tags:
  - "react.js"
  - "javascript"
  - "create-react-app"
  - "환경변수"
  - "민감정보"
description: "create-react-app을 이용하여 프로젝트를 진행하는 경우에 민감정보를 어떻게 관리하면 좋을지에 대해서 정리한다"
---


> create-react-app을 이용하여 프로젝트를 진행하는 상황에서 민감정보를 관리했던 방법에 대해서 정리한다. 해당 내용은 `create-react-app` 페이지의 [adding-custom-environment-variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)문서를 참조하여 정리했다. 

민감 정보라 하면 보통 api의 endpoint 및 api 인증을 위한 token, id/pw와 같은 인증 정보들을 말한다. 보통 작업한 내용들의 경우 git등을 이용하여 코드 관리를 진행하는데, 이 과정에서 git에 민감 정보가 들어가는 경우 보안 위협 요소가 되기에 별도로 분리하여 관리를 한다.

보통은 환경 변수에 등록하여 사용하거나 INI와 같은 설정 파일로 관리를 하는데 여기서는 별도의 .env 파일로 분리하여 관리하는 방법만 다룬다. 일반 환경파일로 설정하고 싶은 경우는 위의 링크를 참조하면 된다.

프로젝트의 root 경로에 `.env` 파일을 생성 한뒤 아래와 유사하게 코드를 작성한다.
```
REACT_APP_USERNAME=user_id
REACT_APP_PASSWORD=password
```

위의 코드가 끝이다. 사용하고 싶은 설정 값의 명칭을 위와 같이 추가하여 작성하면 된다. 여기서 주의할 점은 앞에는 항상 `REACT_APP_` 이 붙어야 한다는 것이다. 그래야 CRA에서 정상적인 환경설정 값으로 인지하여 사용이 가능하다.

해당 값을 가져오는 방법은 별도의 모듈 호출 없이 CRA로 생성된 프로젝트 파일 내에서 공통으로 아래와 같이 작성하면 된다.
```javascript
// .env
let username = process.env.REACT_APP_USERNAME;
let password = process.env.REACT_APP_PASSWORD;
```
위와 같은 방식으로 환경설정 값을 가져와서 사용이 가능하다.

`.env` 파일에 들어가는 형식 및 사용 스타일을 봤을때 서비스가 실행되는 시점에서 `.env`의 파일을 환경 변수에 등록하여 사용하는 듯 하다.

여기서 추가적으로 `.env`파일명 뒤에 , `.test, .local, .development` 등의 이름을 붙여서 각 개발 환경에 맞추어 적용하는 방법도 있으니 해당 방식을 원하는 경우 [adding-custom-environment-variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)를 참조하자.