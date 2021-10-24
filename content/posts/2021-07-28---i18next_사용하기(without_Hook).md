---
title: "react-i18next를 hook없이 사용하기"
date: 2021-07-28T05:37:08.151Z
template: "post"
draft: false
slug: "/posts/react-i18next(without_Hook)/"
category: "develop"
tags:
  - "javascript"
  - "react"
  - "i18next"
description: 다국어 모듈인 react-i18next를 일반 함수처럼 활용하기
---

> 💡 서비스를 개발하면서 개인적으로 정리한 내용으로 글이 깔끔하지 않을 수 있습니다.

## TL;DR

> [react-i18next](https://react.i18next.com/) 모듈을 hook이 아닌 방식으로 사용하는 방법을 설명합니다.

---

## 개요

React를 기반으로 개발할때 다국어 기능을 추가할 경우 선택하는 모듈중의 하나가 `react-i18next` 으로 react-i18next는 React의 hook을 지원하며, 빠르고 간편하게 다국어 기능을 구현할 수 있다.

다만, hook이 아닌 환경에서 다른 모듈을 사용하지 않고 동일한 모듈을 이용하려 구현한다면 별도의 추가작업을 해야하는데, 여기서는 그 추가 작업에 대한 내용을 중점으로 다룬다.

## 기본적인 i18next 사용

> 🚨 우리가 사용하는건 i18next를 기반으로 만든 `react-i18next`입니다. `i18next`가 아닙니다.

다국어 처리를 위해서 react-i18next를 사용할때 hook 기반의 `useTranslation` 를 이용하여 매우 편리하게 사용이 가능하다.

```jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const TransComponent: React:FC = () => {
  const { t } = useTranslation()

  return (
  <span>{t("translate me")}</span>
  )
}
```

> useTranslation() 빠진 부분 수정 (21/10/24)

위와 같이 사용하기만 해도 `translate me` 는 다국어 처리가 된다.

## function 형태로 사용

하지만, 개발도중 변수 또는 상수등의 값에 다국어 처리를 하려는 경우 위와 같은 방식은 사용할 수 없다.(component에 props 형태로 전달 방식도 가능하지만, 전달되는 모든 값이 아닌 필요 값만 변환되길 원한다.)

예를 들어서 아래와 같이 선언된 코드에서 다국어 처리를 하려면, 해당 값을 component 내에 선언하지 않는 이상 다국어가 적용되지 않는다.

```jsx
// TableConf.js
export const TableColumns = [
  { title: "Column1", index: "column1" },
  { title: "Column2", index: "column2" },
  { title: "Column3", index: "column3" },
];
```

이럴때 아래와 같은 function을 만들어서 활용이 가능하다.

```jsx
// funcTrans.js
import { Translation } from "react-i18next";

export function funcTransI18N(value: string) {
  return <Translation>{(t, { i18n }) => <span>{t(value)}</span>}</Translation>;
}

// TableConf.js
export const TableColumns = [
  { title: funcTransI18N("Column1"), index: "column1" },
  { title: "Column2", index: "column2" },
  { title: "Column3", index: "column3" },
];
```

위와같이 처리할 경우 기존의 react-i18next 모듈을 이용하면서 기본 JS 코드에서도 다국어를 같이 적용하여 사용 가능하다.

> 💡 `react-i18next` 의 설정 및 사용법도 알고싶다면 comment 또는 mail로 요청주세요.
