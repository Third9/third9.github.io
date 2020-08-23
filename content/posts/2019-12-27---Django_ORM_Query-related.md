---
title: Django ORM의 Query-related 정리
date: "2019-12-27 17:00:00.704249"
template: "post"
draft: false
slug: "/posts/Django_ORM_Query-related/"
category: "develop"
tags:
  - "python"
  - "django"
  - "orm"
description: "Django ORM에서 Query-related를 사용하며, 헷갈리던 부분들에 대한 정리"
---

## Query-related class
### > Intro
Django에서 ORM을 사용하는데 있어서 보통의(가벼운) SQL 작업에는 큰 문제가 없지만, 여러개의 Table을 join 또는 조건문을 거는 경우에는 일반적으로 사용하던 방식으로 ORM을 사용하면 사용이 어렵거나 복잡해지는 경우가 있다.

이러한 문제를 조금이라도 Django에서는 Query-related class 가 존재한다. 

여기서 설명할 것은 `F`와 `Q` 이다. F와 Q는 모두 Django ORM에서 활용되는 method인데 이를 이용하면 SQL문의 캡슐화 및 DB 레벨에서의 사용이 가능하다는 장점이 있다.

### > F() expressions
`F()`의 기능은 모델의 Field와 관련한다.

```python {numberLines}
# F()를 사용하지 않은 일반 field 값의 증가
model_obj = Model.objects.get(name='third9')
model_obj.age_field += 1
model_obj.save()

# F()를 사용한 일반 field 값의 증가
from django.db.models import F

model_obj = model_obj.objects.get(name='third9')
model_obj.age_field = F('age_field') + 1
model_obj.save()
```

위의 예시와 같이 사용가능하다. 위의 내용만 보았을때는 `F`를 사용할뿐 실제 결과값이 달라지지는 않는다. 다만 문서에서는 `F`를 이용한 방식은 SQL 구조적으로 되어있다고 하는데, 이부분은 위의 예시에서 `model_obj.age_field` 가 Model 객체에서 해당 필드의 값을 가져와 python 메모리에 저장하여 사용을 한다면, `F('age_field')` 는 직접 DB단계에서 작업을 수행한다고 한다. 그러한 이점으로 

F() 를 사용하는 방식이 python 친화적이면서 동시에 같은 Table의 field를 접근하여 작업 수행시에 발생할 수 있는 DB의 Race condition문제를 손쉽게 회피 할 수 있다고 한다.

개인적으로는 F() 보다도 Q()를 더 자주 사용하게 되는데 Q()는 일반적인 query문을 간략하게 작성해서 객체로 저장, 참조 할 수 있도록 해준다. Server-side에서 query문을 사용할때 다양한 조건문을 추가하기도 하고, 분기에 따라서 조건을 다르게 하는 경우가 많은데 Q()를 이용하면, ORM에서 보다 깔끔하게 유사한 작업을 할 수 있다.

### > Q() objects
 `Q()` 의 사용은 아래와 같이 한다.

```python {numberLines}
# Q() 사용의 예시
from django.db.models import Q

Model.objects.filter(Q(id='value1') | Q(name='value2'))

# 또는 아래
q1 = Q(id='value1')
q2 = Q(name='value2')
Model.objects.filter(q1 | q2)

# 또는 더 아래
q_query = Q(id='value1')
q_query.add(Q(name='value2'), Q.OR)
Model.objects.filter(q_query)

""" SQL 문
SELECT * FROM model WHERE id='value1' OR name='value2' 
"""
```

위의 방식처럼 조건식을 넣을 수가 있다. 위는 Q를 OR로만 표현한 경우이고 AND, NOT 등에 대한 표현도 손쉽게 가능하다.

```python {numberLines}
# 위의 코드에 이어서 

# AND
Model.objects.filter(Q(id='value1') & Q(name='value2'))

# NOR
Model.objects.filter(Q(id='value1') | ~Q(name='value2'))
```

 위에 나온 방식들을 모두 활용한다면 아래와 같이 사용가능 하다.
```python {numberLines}
""" 원하는 SQL 문
SELECT * 
FROM model 
WHERE name='value1' or (id='value2' and age > 15)
"""

q_query = Q(name='value1')
q_query.add(Q(id='value2') & Q(age_gt=15), Q.OR)

Model.objects.filter(q_query)
```

위의 F()와 Q()를 잘 활용하면 Django ORM을 사용하는데 있어서 보다 효율적인 사용이 가능하다.