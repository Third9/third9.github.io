---
title: DRF(Django-Rest-Framework)를 이용한 pagination/search 기능 구현
date: "2019-11-11 19:30:33.046034"
template: "post"
draft: false
slug: "/posts/DRF(Django-Rest-Framework)를_이용한_pagination/search_기능_구현/"
category: "develop"
tags:
  - "Python"
  - "Django"
  - "Django-Rest-Framework"
description: "django-rest-framework를 이용하여 pagination/Search 기능을 구현하는 법을 설명."
---

> django-rest-framework를 이용하여 pagination/Search 기능을 구현하는 법을 설명., 모듈의 설치와 관련한 사항은 여기서 언급하지 않는다.
>
> 설명을 위한 drf의 버전은 3.2.5 이며, pagination 기능이 drf 3.1 이상부터 추가되었으므로 그 이상읠 버전을 사용해야 한다.

## Pagination 구현

> pagination은 일반적으로 많이 보이는 List 형태의 View에서 많이 사용된다.  `이전페이지`,`다음페이지` 등과 같은 기능을 구현 하는데 직접 구현도 가능하지만 drf의 pagination 기능을 사용하면 손쉽게 처리가 가능하다.
>
> 보통 RestAPI `query-param`에 `?page_size=1` 과 같은 형태로 넘겨진다. 

drf의 pagination 구현은 `django`의 `settings.py` 파일을 수정하는 방식과 별도의 class를 만들어서 구현하는 방식이 있다. `settings`를 수정하면 기존의 다른 class 들에 별다른 작업없이 pagination읠 기능 구현 가능 및 해당 drf를 사용중인 RestAPI 전체에 pagination 기능을 구현 할 수 있다.

- settings.py 를 이용한 pagination 적용

  ```python
  REST_FRAMEWORK = {
      'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
      'PAGE_SIZE': 100
  }
  ```



전체 API가 아닌 원하는 Class에만 pagination 기능을 구축하려 한다면 아래와 같이 한다.

```python
# ./api/v1/paginations.py
'''
별도의 모듈로 분리하지 않아도 된다.
''' 

from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    # page_size를 None으로 할경우 param에서 page_size를 넘기지 않으면 전체 데이터를 가져온다.
    page_size = None
    page_size_query_param = 'pagesize' # 자기가 원하는 param
    max_page_size = 1000

class NotStandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page'
    max_page_size = 1000

```

> 위와 같이 pagination 스타일을 분리하여 필요에 맞는 스타일을 가져와서 활용이 가능하다.

- 특정 api class 에만 pagination 구현

```python
# ./api/v1/views.py
...
from rest_framework import viewsets
from paginations import StandardResultsSetPagination, NotStandardResultsSetPagination

class StandardViewSet(viewsets.ModelViewSet):
  ...
  pagination_class = StandardResultsSetPagination
  ...
  
class NotStandardViewSet(viewsets.ModelViewSet):
  ...
  pagination_class = NotStandardResultsSetPagination
  ...
```

위와 같은 형태로 각 API class 별로 원하는 pagination 스타일을 구현 할 수 있다.

- 전체 api class에 pagination 구현

  전체 API에 구현하기 위해서는 앞서 나온 내용처럼 `settings.py`를 수정하여야 하며 `paginations.py` 스타일을 가져와 사용하기 위해서는 아래와 같이 한다.

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'api.v1.paginations.StandardResultsSetPagination'
}
```



위 처럼 코드를 작성하면 별다른 작업없이 pagination 기능의 구현이 가능하다.

추가로 무한 스크롤과 같은 형태의 구현을 원한다면 `CursorPagination` 모듈을 이용하여 아래와 같은 구현이 가능하다. 방식은 앞서 나온 pagination 방식과 동일 하며  `PageNumberPagination`모듈을  `CursorPagination`모듈로 변경하면 된다. cursor는 page 방식처럼 어느 위치의 데이터인지 사용자 입장에서 알지 못하게 하거나 알 필요가 없을때 유용하다. cursor 방식과 page 방식의 차이는 데이터를 가져오는 기준의 값이 page가 아닌 cursor(id) 방식이라 것에 차이가 있다. 또한 cursor는 `page_size_query_param`가 아닌 `cursor_query_param`을 속성 값으로 가진다.

```python
# CursorPagenagtion

from rest_framework.pagenation import CursorPagination

class StandardCursorPagination(CursorPagination):
    page_size = 20
    # page의 cursor를 구분하기 위해선 model의 unique한 field를 필요로 한다.
    cursor_query_param = 'id'
    # 정렬 순서를 특정 필드를 선택하여 정할 수 있다.
    ordering = '-log_date'
```
