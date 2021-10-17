---
title: "React환경의 Multi-Proxy 구현"
date: "2020-06-21 16:53:12"
template: "post"
draft: false
slug: "/posts/multi-proxy_of_react/"
category: "develop"
tags:
  - "React.js"
  - "proxy"
  - "http-proxy-middleware"
description: "React환경에서 multi-proxy사용하기"
---

> 🚨 아래에서 설명할 proxy customize를 원활히 수행하기 위해서는 CRA(v2)가 필수이다. react 프로젝트 생성시에 CRA(v2)를 이용하지 않았을 경우 원활한 수행이 안될 수 있다.

## Intro

React를 이용한 프로젝트를 진행하면서 겪었던 삽질들을 하나하나 정리중이다. 그 중에서 React를 이용하여 외부의 API 를 호출할때 cors 이슈가 발생하였는데, 해당 이슈는 server 에서 response 되는 내용의 header에 `'Access-Control-Allow-Origin': '*'` 를 넣어주면 해결이 되는 것으로 알고 있지만 server를 수정할 수 있는 권한이 없는 경우에는 reactjs 의 `package.json` 에 `proxy` 설정을 해주면 된다.

> 💡Proxy와 관련한 설정은 수정한 경우, react test 서버를 재시작해줘야 한다. js 코드가 변경되었을때 자동을 hot-load 되는 형식으로는 proxy설정이 반영되지 않는다.

## #Package를 이용한 기본 proxy 설정

reactjs를 셋팅하면 기본적으로 설정되는 `package.json` 파일에 아래와 같이 선언을 해주면 된다.

```json
// package.json

...
"proxy": "http://local.test.com"
```

아래는 proxy test를 위해서 임의로 작성한 코드이며, http 통신은 axios를 이용하였다.

```jsx {numberLines}
// apiConnectTest.js
import axios from 'axios';

// HTTP GET
const async getReq = () => {
	try {
		const res =	await axios.get('/local/req');
		console.log(res);
	} catch (err) {
		console.log(err);
	}
}

// HTTP POST
const async postReq = () => {
	try {
		const res =	await axios.post('/remote/req', {id:'test'});
		console.log(res);
	} catch (err) {
		console.log(err);
	}
}
```

위와 같은 코드를 선언하고, `getReq` , `postReq` function을 호출하게 된다면 두 요청 모두 우리가 위에서 설정한 proxy 경로를 타고 호출된다.

```ps
getReq ⇒ http://local.test.com/local/req
postReq ⇒ http://local.test.com/remote/req
```

다만, 서비스 종류에 따라서 한곳이 아닌 복수의 경로로 호출을 해야할 수 있다. 그러한 경우에는 `http-proxy-middleware` 를 이용한다.

## #http-proxy-middleware를 이용한 Multi-proxy 처리

multiproxy 기능을 사용하기 위해서는 우선 `http-proxy-middleware`를 설치하여야 한다.

```ps
$ yarn add http-proxy-middleware
```

기본 src 폴더 하위에 `setupProxy.js` 파일을 아래와 같은 형태로 작성한다. 맨 위에서도 설명하였지만, setupProxy를 통한 proxy customize는 해당 프로젝트를 CRA(v2)를 이용하여 생성하였어야 한다.

```jsx {numberLines}
// setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
	// auth 포함 하위 route에 대해서는 localhost:5000/v1을 domain으로 하여 proxy설정
  app.use(
		'/local',
		createProxyMiddleware({
			target: 'http://local.test.com',
			changeOrigin: true,
		}))
	// dummy 포함 하위 route에 대해서는 localhost:6000/v1을 domain으로 하여 proxy설정
  app.use(
		'/remote',
		createProxyMiddleware({
			target: 'http://remote.test.com',
			changeOrigin: true,
		})
}
```

위와 같이 작성한 경우 route 설정에 따라서 동작하며, 위에서 사용했던 `apiConnectTest.js` 코드를 예로 든다면 아래와 같이 동작한다.

```ps
getReq ⇒ http://local.test.com/local/req
postReq ⇒ http://remote.test.com/remote/req
```

여기서는 언급하지 않았지만 `http-proxy-middleware` 모듈을 이용하면 pathRewrite 옵션을 통해서 새로운 api로의 rewrite 기능도 사용이 가능하다.
