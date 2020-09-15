---
title: "docker를 이용한 Sentry 20.8.0 설치와 Upgrade"
date: 2020-09-14T23:22:12.311Z
template: "post"
draft: false
slug: "/posts/docker를_이용한_Sentry_20_설치_upgrade/"
category: "develop"
tags:
  - "sentry"
  - "docker"
  - "docker-compose"
  - "sentry 20.8.0"
description: Sentry on-premise 최신버전인 20.8.0 을 docker-compose를 이용하여 설치하는 방법과, 이전 docker를 사용하지 않은 9.1.2 버전을 docker를 사용한 형태로 upgrade 하는 방법에 대해서 다룹니다.
---

# Sentry 20.8.0 설치와 Upgrade

이전에 sentry에 대해서 다루었지만, 한동안 안본 사이에 버전이 20.8.0으로 upgrade 되었다.
그와 함께 docker-compose를 이용하여 설치하도록 변경되어으며, 좀더 대용량 데이터 처리에 적합하게 다양한 서비스들이 추가되었다.

> 설치 환경

- Ubuntu: 16.04
- python: 2.7.17
- Sentry: 20.8.0
- postgreSQL: 9.6

> 9.1.2 버전 이후부터 sentry는 docker를 이용한 설치를 지원 및 권장하고 있다.
> 직접 일일이 설치하여 셋팅도 가능하지만, 10 버전부터 sentry에서 자체적으로 지원하는 검색/필터링 서비스인 snuba가 포함되었고, 직접 셋팅하기에는 설치할 것도 많고, 복잡도도 늘어나서 docker-compose를 이용하여 설치하는 것이 건강에 좋다.

## docker와 docker-compose의 설치

> 여기서는 docker 설치와 관련해서 최소한의 설명만을 이야기하고, docker의 설치방법과 관련해서 자세한 내용은 링크를 참조 바란다. [docker 설치](https://docs.docker.com/engine/install/ubuntu/), [docker-compose 설치](https://docs.docker.com/compose/install/)를 참조 바란다.

> docker와 docker-compose는 별개이다. 각각 따로 설치를 해줘야 한다.

## git에서 sentry 내려받아 설치하기

설치를 위한 `install.sh` 스크립트와 docker-compose 파일들을 git 명령어를 이용해서 가져온다.

```ps
# sentry pull로 가져오기
$ git clone https://github.com/getsentry/onpremise.git ./sentry
```

위의 작업이 완료된 후 아래의 명령을 실행한다.

```ps
# sentry path로 이동 후 설치 스크립트 실행
cd ./sentry
sudo ./install.sh
```

설치까지 완료되었으면, docker-compose cli를 이용하여 실행 시켜주면 된다.

```ps
# Sentry 서비스들 실행
$sudo docker-compose up -d
```

끝이다. 이전 글에서 sentry 설치와 설정했던 부분들에 비하면 할일이 없다.
실행중인 container를 확인하거나, 종료시키고자 할때는 아래와 같은 명령어를 사용하면 된다.

```ps
# 실행중인 container들 출력
$sudo docker-compose ps

# 서비스 종료
$sudo docker-compose down
```

## Sentry 최신버전으로 Upgrade

> 일반 환경의 9.1.2 버전에서 docker환경의 20.8.0으로 upgrade 한다.

여기서부터는 이전 글에서 설치한 일반 환경에서의 sentry 9.1.2 를 docker 환경의 20.8.0로 올리는 내용을 다룬다.
우선 위의 글 내용중에서 git을 이용하여 sentry repo를 clone하는 작업까지만 수행한 뒤에 다음 작업을 진행한다.

### #docker-compose 수정

기존 설치와 다른점은 docker-compose의 설정을 수정해줘야 한다는 것이다. `docker-compose.yml`파일을 열어서 `services` 아래의 `postgres` 항목을 보면 `volumes:` 아래에 해당 db 데이터가 보관될 경로가 있다. 내용을 아래와 같이 바꿔준다.

```yml
# before
- "postgres:/var/lib/postgresql/data"

# after
- "/mnt/postgresql/data:/var/lib/postgresql/data"
```

### #postgre-SQL upgrade

> postgresql 9.4 to 9.6

위의 `docker-compose.yml` 파일을 열었을때 postgresql의 버전을 같이 확인하자,
보통 sentry가 9.1.2 버전이하라면 postgresql의 버전은 9.4일것이고, sentry의 최신버전인 20.8.0라면 postgresql의 버전은 9.6일 것이다.(나중에 버전up이 되면서 달라질 수 있다)

기존 sentry에서 사용되던 postgresql의 버전과 upgrade하려는 sentry가 사용하는 postgresql의 버전을 일치시켜주는 작업이 필요하다.
여기선 9.4 to 9.6 이다, 데이터 용량이 크면 시간이 오래걸린다.

버전업과 관련해서는 내용이 긴 관계로 여기서 다루진 않고 관련문서의 링크를 공유한다.
[upgrade-postgres-9.4-to-9.6.md](https://gist.github.com/dmitrykustov/27c673ec4f7abd716912e4c830910019)

### #install 스크립트를 이용한 설치

위의 작업까지 진행하였다면, 우선 `install.sh`스크립트를 이용하여 sentry를 설치해준다.

```ps
$ sudo ./install.sh
```

### #새로운 docker 환경의 sentry db 전달

위에서 postgreSQL 컨테이너의 db 데이터 폴더를 `mnt/postgresql/data`와 연결하였으므로 해당 경로로 이동하면 데이터 파일들을 볼 수 있다. 해당 폴더에 기존 sentry에서 사용하던 db의 데이터를 전부 복사한다.

```ps
# 일반적인 DB의 경로는 아래와 같다
$ /var/lib/postgresql/9.6/main;
```

위의 9.4는 postgreSQL의 버전이므로 버전에 따라 변경 될 수 있다. 복사할때 data의 크기에 따라서 시간이 정비례하여 증가한다.

복사가 완료되었으면 복사된 경로로 가보자 `/mnt/postgresql/data` 해당 경로에 가서 user 권한을 확인하면, `root` 로 설정이 되어있을거다. docker에서 접근이 가능하도록 권한을 변경해준다.

```ps
# su 모드
chown -R 999:docker ./*
```

### #sentry 설정파일 수정

위의 작업 까지 마쳤다면, sentry repo를 다운받은 경로로 가서 [`sentry.conf.py`](http://sentry.conf.py) 파일 찾자 보통 해당 repo 경로의 ./sentry 폴더 밑에 존재할거다. `sentry.conf.py` 파일을 열어서 수정한다.
(처음에는 없지만, `./install.sh` 명령을 수행하고 나면, 해당 설정 파일이 생성되어있다.)

```py
# before
DATABASES = {
    "default": {
        "ENGINE": "sentry.db.postgres",
        "NAME": "postgres",
        "USER": "postgres",
        "PASSWORD": "",
        "HOST": "postgres",
        "PORT": "",
    }
}

# after
DATABASES = {
    "default": {
        "ENGINE": "sentry.db.postgres",
        "NAME": "sentry",
        "USER": "posgres",
        "PASSWORD": "{password}",
        "HOST": "postgres",
        "PORT": "",
    }
}
```

기존 sentry의 db 명칭과 유저 명칭을 postgres 로 하였다면 수정하지 않고 그대로 놔둬도 된다. 하지만, 다른 이름을 사용하였다면 기존 sentry db에서 사용한 database의 이름과 user/pw를 입력해야 한다. 필자가 쓴 이전 sentry 설정 글을 보고서 만들었다면, 아마도 name은 sentry로 되어있을 것이고, user도 sentry로 되어있을텐데, 그렇게 바꾸면 된다. 다만 유저는 postgres 유저도 같이 등록되어 있어서 그냥 놔뒀다.

sentry의 메일 기능도 이용할 것이라면, 이전 sentry의 메일 설정을 등록해준다. 설정은 `config.yml`을 수정하면 되는데, `sentry.conf.py`와 같은 경로에 존재한다.

```ps
#----- before -----

###############
# Mail Server #
###############

# mail.backend: 'smtp'  # Use dummy if you want to disable email entirely
mail.host: 'smtp'
# mail.port: 25
# mail.username: ''
# mail.password: ''
mail.use-tls: false
# The email address to send on behalf of
# mail.from: 'root@localhost'
```

위의 형식이 원본 셋팅인데 본인 메일 설정에 맞게 변경한다.

설정이 모두 완료되었다면 sentry 서비스를 실행한다. `docker-compose.yml`이 있는 경로로 이동한뒤에 여기서는 `./install.sh` 를 실행하지 않고, sentry를 upgrade 시켜준다.

```ps
# docker-compose cli를 이용하여 web 컨테이너 내부에 존재하는 sentry를 upgrade시킨다.
$ sudo docker-compose run --rm web upgrade
```

물론 위의 작업을 수행할때는 `docker-compose down` 명령어를 이용하여 올라가있는 모든 컨테이너를 내리고, 기존의 sentry 서비스들과 db도 같이 내려둔다.
기존 sentry의 데이터양에 따라서 시간이 오래 걸릴수 있다. 위의 작업이 모두 완료되었다면, docker-compose cli를 이용하여 서비스를 실행시켜준다.

```jsx
sudo docker-compose up -d
```
