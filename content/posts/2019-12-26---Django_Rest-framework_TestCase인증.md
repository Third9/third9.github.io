---
title: Django Rest-framework API에 TestCase작업시 인증방법
date: "2019-12-26 18:40:00.704249"
template: "post"
draft: false
slug: "/posts/drf-testcase-인증방법/"
category: "develop"
tags:
  - "python"
  - "django"
  - "RestFramework"
  - "drf"
description: "Django-Rest-framework를 이용한 API의 TestCase작성시 사용자 인증에 대한 선행작업의 내용입니다."
---

## Intro
> 여기서는 Django의 User class를 상속하지 않은 상황에서의 Django-Rest-Framework API에 대한 인증 Test에 대해서 다룹니다.

Django를 이용한 프로젝트에서 API 서비스에 대하여 Test를 진행하려 할때 인증과 관련한 부분이 걸립니다. Unit-Test에서 별도의 인증키를 받는 로직을 구현해서 Test 하여도 되지만 여기서는 다르게 진행합니다.

## 인증방법
일반적으로 Django의 User Class를 상속받아서 진행을 하였다면 인증에 큰 문제는 없습니다. DRF(Django-Rest-framework)를 이용하여 개발한 경우 `APIClient` 를 이용하면 되죠. 
아래와 같은 방식으로 인증절차를 통과할 수 있습니다.
```python
# 일반적인 User class를 상속한 경우
from rest_framework.test import APIClient

client = APIClient()
client.login(username='user, password='pass')
```

다만, Django의 User class를 상속 받지 않은 경우는 `force_authenticate` method를 이용하여 처리 할 수 있습니다.

```python
# 강제로 인증을 위한 
client.force_authenticate(user='user')
```
위와 같은 방식을 통해서 강제로 인증절차를 수행할 수 있습니다. 위의 방식으로 인증이 진행되었으면 해당 client 객체를 이용하여, `get, post, put, delete` 등의 API 호출의 진행이 가능하므로 인증 절차 후의 TestCase를 수행 가능합니다.

## 추가사항
제가 Test를 진행하던 프로젝트는 기존에 만들어진 프로젝트에 TestCase를 추가하던 상황이었는데 Django 버전이 1.6 이었습니다. Test를 위한 method를 1개만 놓을때는 문제 없었던 부분이 2개 이상을 선언하고 진행하는 경우 `AttributeError: 'IntegrityError' object has no attribute '__traceback__'`라는 에러 메시지가 나올 수 있는데 해당 상황의 경우가 Test 당시 `setUp`에서 model object를 생성해주는 작업을 진행하였다면 `tearDown` 시점에서 해당 model 객체를 제거해 주는 작업을 같이 진행해 줘야 합니다.