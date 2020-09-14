---
title: Sentry server 설치(20.09.13 수정)
date: "2019-11-11 19:27:46.081432"
template: "post"
draft: false
slug: "/posts/sentry_server_설치/"
category: "develop"
tags:
  - "Sentry"
  - "python"
description: "Error tracking과 Log 관리등을 원격으로 관리할 수 있게 해주는 모니터링 서비스 Sentry를 직접 설치 및 운영한다."
---

# Sentry 서버 설치

> Sentry는 error-tracking과 log관리등의 이슈관리를 위한 모니터링 서비스다.

- Ubuntu:14.04
- python:2.7
- Sentry: 8.18.0
- postgreSQL: 9.4
- Redis: 3.2.9

## 설치 전 모듈 및 서버 설정

설치를 위한 기본 환경은 위와 같으며 sentry 설치 전 몇가지 setting을 해주어야 한다.

1. sentry 의 원할한 설치 및 구동을 위해서 sentry라는 명칭의 계정을 생성한다

   ```ps
   # 해당 명령어 실행 후 나오는 입력 내용을 순차적으로 입력한다.(Id, password, name 등등)
   $ adduser sentry
   ```

2. sentry 설치를 위한 모듈들 설치

   ```ps
   $ sudo apt-get install -y python-pip \
   python-setuptools \
   python-dev \
   libxslt1-dev \
   gcc \
   libffi-dev \
   libjpeg-dev \
   libxml2-dev \
   libxslt-dev \
   libyaml-dev \
   libpq-dev
   ```

3. 위의 작업까지 마무리 하였다면 다음으로 worker의 역할과 issue 보관을 위한 redis와 postgresql을 설치해야 한다. worker의 역할은 rabbitMQ도 사용 가능하지만 여기서는 redis를 사용한다.

## Sentry 연동을 위한 Postgre-SQL 설치 및 셋팅

> PostgreSQL은 12.04, 14.04, 16.04 버전의 경우는 ubuntu의 apt repo를 통한 설치를 정상적으로 지원한다. 여기서는 `9.4` 버전의 설치를 다룬다.
>
> 또한, 버전에 따라서 설치에 조금씩의 차이가 있는데 해당 방법은 [링크](https://www.postgresql.org/download/linux/ubuntu/)를 통해서 안내한다. 여기서는 14.04 버전을 기준으로 안내한다.
>
> Redis의 설치 방법은 여기선 다루지 않는다.

### #Postgre-SQL 설치

```ps
# 우선 pgdg list를 만든다. (이미 존재하는 경우 파일 생성없이 내용만 추가)
$ cd /etc/apt/sources.list.d/
$ touch pgdg.list

# pgdg.list 파일 생성 후 해당 파일내에 아래의 내용을 추가 후 저장한다.
deb http://apt.postgresql.org/pub/repos/apt/ trusty-pgdg main

# 이후에 아래의 명령어를 수행한다.
$ wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | \
	sudo apt-key add -
$ sudo apt-get update

# 위의 작업까지 완료하였다면 아래의 명령어로 postgresql을 설치한다.
$ apt-get install postgresql-9.4
```

### #Postgre-SQL 셋팅

> PostgreSQL 명령어 [링크](https://www.postgresql.org/docs/current/static/sql-commands.html)

```ps
# postgresql 관리자 계정이 정상적으로 생성되어 있는지를 확인한다.
$ cat /etc/password | grep 'postgres'

# PostgreSQL 작동여부 체크
$ /etc/init.d/postgresql status

# 작동중이지 않다면 start 명령을 이용하여 작동시켜준다.(이미 동작중이면 실행하지 않아도 된다.)
$ /etc/init.d/postgresql start

## 관리자 계정의 password 변경 및 sentry 계정 생성을 위해서 psql에 접근
# 관리자 계정 postgres로 접근
$ sudo -u postgres psql template1

# password 변경
template1=# ALTER USER postgres with encrypted password '패스워드';

# sentry 계정 추가 및 LOGIN 권한 부여 (Password는 위에서 postgres 계정에 부여 하듯이 하면 된다.)
template1=# CREATE ROLE sentry WITH LOGIN;

# 계정 추가 후 해당 계정에 권한을 추가한다. (sentry 실행시 관련 db등을 생성하기에 sentry 계정 사용시 권한이 있어야 한다.)
template1=# ALTER ROLE sentry WITH CREATEDB CREATEROLE;

# 데이터 베이스 권한 부여
template1=# GRANT ALL ON DATABASE databasename TO username;

# 작업을 모두 마치면 정상적으로 접근 가능한지 Test., 두개의 계정모두 접속 가능한지 test 한다.
$ psql -h 127.0.0.1 -U postgres template1
$ psql -h 127.0.0.1 -U sentry template1
```

### #Sentry 설치

#### 1. python 환경설정 및 sentry 설치

sentry는 Django기반의 서비스이므로 virtualenv를 이용해서 환경 설정을 한 뒤 진행하는 것을 추천한다.

```ps
# virtualenv install
$ pip install -U virtualenv

# virtualenv setting
$ virtualenv ~/.venv/sentry

# virtualenv activate
$ . ~/.venv/sentry/bin/activate

# sentry 설치
$ pip install -U sentry==8.18.0
```

위의 작업까지 성공적으로 이어졌다면 sentry 서버 구동을 위한 설정 및 실행을 하면 된다. 하지만 정상적으로 구동하지 않고 에러가 출력되면 그에 대응하는 작업을 수행해야 한다. 에러 메시지는 사용자의 상황마다 다르므로 여기서는 2개 정도의 에러에 대해서만 간략히 설명한다.

> E1: ValueError: jpeg is required unless explicitly disabled using --disable-jpeg, aborting
>
> ```ps
> # 아래의 모듈 설치
> $ sudo apt-get install libjpeg-dev zlib1g-dev
> ```

> E2: error: command 'x86_64-linux-gnu-gcc' failed with exit status 1
>
> ```ps
> # 아래의 모듈 설치
> $ sudo apt-get install libssl-dev libffi-dev
> ```

#### 2. Sentry 초기 환경설정

위의 작업까지 진행하여 설치를 완료하였다면 sentry 설정을 진행한다.

```ps
# init 파일 생성(기본 생성 위치는 '~/.sentry' 이다)
$ sentry init {경로 위치}
ex) sentry init or sentry init /etc/sentry
```

위의 명령어 실행 후 해당 위치에 생성된 sentry.conf.py 파일을 수정

```python
# ~/.sentry/sentry.conf.py

# for more information on DATABASES, see the Django configuration at:
# https://docs.djangoproject.com/en/1.6/ref/databases/
DATABASES = {
    'default': {
        'ENGINE': 'sentry.db.postgres',
        'NAME': 'sentry',
        'USER': 'sentry', # postgresql에 등록한 계정으로 입력
        'PASSWORD': 'postgresql 계정 password',
        'HOST': '', # local인 경우 127.0.0.1
        'PORT': '', # postgresql의 port
    }
}
```

> Redis의 경우 기본 설정을 그대로 사용한다면 별도로 수정할 부분은 없다., mail발송을 위한 설정을 할 수 있지만 여기서는 다루지 않는다(메일서버는 sendmail을 이용하는 것이 일반적이다)

모든 설정을 마무리 하였으면 순차적으로 명령어를 실행하여 migration 작업을 수행한다.

```ps
# sentry migration
# DB 생성에 있어서 여기서는 sentry 라는 명칭을 사용한다.
$ createdb -E utf-8 sentry

# 아래의 명령을 수행하면 postgresql/redis에 sentry 관련 데이터를 생성하며, sentry 계정을 만들수 있다.
# 이때에 superuser를 만들지 여부를 물어보는데 여기서 만들어야지 이후에 다시 만드는 작업을 하지 않아도 된다.
$ sentry upgrade

# 추가로 user를 만들생각이면 아래의 명령어로 만들어 주어도 된다.
$ sentry createuser
```

#### 3. Sentry 서버 실행

위의 작업을 모두 완료하였다면 sentry 사용을 위한 서비스들을 실행시킨다. sentry는 데이터 수집 및 스케쥴링, 그리고 Web 서비스를 위한 worker, cron, web 3개의 서비스로 구성되어있다.

```ps
## 아래의 3가지 서비스를 실행시켜야 정상적인 수행이 가능하다.
# sentry의 worker
$ sentry run worker

# sentry의 cron process
$ sentry run cron

# sentry의 web 서버., web 서비스의 경우 가장 마지막에 수행하는 것이 좋다
$ sentry run web
```

#### 4. Daemon 실행

위의 단계를 모두 진행하였으면 sentry 서버를 실행하고 사용하는데는 문제가 없지만, daemon 형태로 서비스를 수행하기 위해서는 systemd, upstart와 같은 프로그램을 이용해서 안정적으로 사용이 가능하다.

> 추가적으로 ubuntu 15부터 systemd를 지원하며, LTS 버전으로 한정할 경우 16버전부터 지원을 한다.
>
> 문서에서 설명한 ubuntu 14에서는 upstart를 사용하므로 upstart 스크립트 작성 및 사용법을 기술한다.
>
> systemd를 이용하여 서비스하는 방법은 [링크](https://docs.sentry.io/server/installation/python/#running-sentry-as-a-service) 참조.

upstart를 이용하여 daemon을 구동할 경우, 시스템 부팅시의 자동 실행 및 서비스 종료시 자동 재시작 로그파일 기록 등등의 장점이 있다. 우선은 아래의 script를 작성하여야 한다. (예시에서는 web만을 작성하였지만 실제로는 worker, cron 등에 대한 script도 만들어야 한다.)

```ps
# upstart에서 수행되는 서비스들의 script는 /etc/init/ 경로에 ***.conf 파일의 형태로 작성해줘야 한다.
$ cd /etc/init/
$ touch sentry-web.conf

# 위에서 생성한 sentry-web.conf 파일을 열어서 script 내용을 등록한다.
$ vim sentry-web.conf
```

위의 작업까지 수행하였다면 아래의 코드를 위에서 만들어둔 `sentry-web.conf` 파일에 작성한다.

```conf
# /etc/init/sentry-web.conf
start on runlevel [2346]
stop on runlevel [016]

# 서비스가 오류로 종료시에 자동 재시작
# (단, 너무 빨리 재시작 되는것에 대한 제한을 수정. 5초 동안 4번 재시작 되면 재시작 하지 않음)
respawn limit 4 5

env USER=www-data
env PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
env PWD=/usr/local/lib/python2.7/dist-packages

# script가 수행되기 전 해당 서비스의 log 생성 및 권한 부여
pre-start script
  if [ ! -f /var/log/sentry-web.log ]; then
    touch /var/log/sentry-web.log
    chown -f $USER /var/log/sentry-web.log
  fi
end script

# 서비스 수행을 위한 main script
script
. /home/sentry/activate  # venv 실행
start-stop-daemon --start \  # daemon으로 수행
  --make-pidfile --pidfile /var/run/sentry-web.pid \ # proccess id 파일
  --chuid $USER \
  --chdir $PWD \
  --exec /home/sentry/.venv/sentry/local/bin/sentry\
        --config=/home/sentry/.sentry/\ # sentry 수행을 위한 환경설정파일
        run web >> /var/log/sentry-web.log 2>&1 # web 서비스 수행 및 log stdout/stderr 로그 등록
end script

# 서비스 종료시에 process id 삭제
post-stop script
  if [ -f /var/run/sentry-web.pid ]; then
    rm /var/run/sentry-web.pid
  fi
end script

```

위와 같이 작성 완료 후 `sudo start sentry-web` 명령어를 실행하면 web이 daemon 으로 수행된다. worker, cron도 위와 같이 script를 작성한 뒤에 실행시켜주면 해당 서비스를 수행할 수 있다.

> 나머지 worker, cron에 관련한 script

```conf
# /etc/init/sentry-worker.conf
start on runlevel [2345]
stop on runlevel [016]

respawn limit 4 5

env USER=www-data
env PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
env PWD=/usr/local/lib/python2.7/dist-packages

pre-start script
  if [ ! -f /var/log/sentry-web.log ]; then
    touch /var/log/sentry-worker.log
    chown -f $USER /var/log/sentry-worker.log
  fi
end script

script
. /home/sentry/activate
start-stop-daemon --start \
  --make-pidfile --pidfile /var/run/sentry-worker.pid \
  --chuid $USER \
  --chdir $PWD \
  --exec /home/sentry/.venv/sentry/local/bin/sentry\
        -- --config=/home/sentry/.sentry/\
        run worker >> /var/log/sentry-worker.log 2>&1
end script

post-stop script
  if [ -f /var/run/sentry-worker.pid ]; then
    rm /var/run/sentry-worker.pid
  fi
end script
```

```conf
# /etc/init/sentry-cron.conf
start on runlevel [2345]
stop on runlevel [016]

respawn limit 4 5

env USER=www-data
env PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
env PWD=/usr/local/lib/python2.7/dist-packages

pre-start script
  if [ ! -f /var/log/sentry-cron.log ]; then
    touch /var/log/sentry-cron.log
    chown -f $USER /var/log/sentry-cron.log
  fi
end script

script
. /home/sentry/activate
start-stop-daemon --start \
  --make-pidfile --pidfile /var/run/sentry-cron.pid \
  --chuid $USER \
  --chdir $PWD \
  --exec /home/sentry/.venv/sentry/local/bin/sentry\
        -- --config=/home/sentry/.sentry/\
        run cron >> /var/log/sentry-cron.log 2>&1
end script

post-stop script
  if [ -f /var/run/sentry-cron.pid ]; then
    rm /var/run/sentry-cron.pid
  fi
end script
```

> 이전 버전의 경우 환경설정의 경로를 `{your path}/sentry/sentry.conf.py` 로 표기하는 경우가 있는데 그럴경우 secret-key 가 없어서 새로 생성하라는 메시지가 뜨는 경우가 있다. 실제로 secret-key가 없는 경우일수도 있지만, 경로가 잘못되어서 발생하는 문제일 수 있다. 최신버전의 sentry는 config.yaml 파일에 secret-key가 존재하기에 최신버전의 경우 환경설정파일 경로를 `{your path}/sentry/` 로 지정해주어야 한다.

## Sentry Upgrade (2020.09.13 내용수정)

> Sentry 8.18.0 => 9.1.2

1. sentry가 설치된 서버에 ssh로 접근을 하여야 한다.

2) 해당 서버에 접근하여 sentry가 설치된 python 환경을 activate 시켜준다.

3. activate된 환경에서 기존에 설치된 sentry의 버전을 upgrdate 해준다.

   > 여기서는 9.1.2 버전의 upgrade에 대한 내용을 다룬다. 9.1.2 이상부터는 Sentry가 docker-compose를 이용한 환경을 지원하기에 그 이상의 버전으로는 가능하다면 docker-compose를 활용한 설치를 추천한다.

   ```ps
   $ pip install -U sentry==9.1.2
   ```

4. 설치가 완료되었다면, 설정 파일을 새로 만들어준다., `단, 무조건 꼭 만들어야 하는건 아니다` 필자도 새로 만들지 않고 진행을 하였다. 하지만 문서에서는 major update인 경우에는 설정 파일을 새로 만드는 것을 추천한다고 쓰여 있다.

5) 위의 작업까지 완료하였다면, sentry cli를 활용하여, upgrade 명령을 수행한다. Sentry는 django를 기반으로 만들어졌기에 해당 upgrade작업시에 DB 모델의 migration 등의 작업을 같이 해주는 걸로 알고 있다.

   >

   ```ps
   $ sentry upgrade
   ```

6) sentry upgrade작업까지 완료되었다면 sentry의 모든 서비스들(web, worker, cron)을 새로 restart 해줘야 한다. 이후에 페이지에 접속하여 version을 확인하면 9.1.2로 upgrade된 것을 확인 할 수 있다.

## 메일 발송 기능 추가 (2020.09.13 내용수정)

우선 메일 발송을 위해서는 메일 서버를 설치하여야 한다.

```ps
$ sudo apt-get install -y sendmail && sudo sendmailconfig
```

메일 서버 설치 후 아래와 같이 설정파일을 수정한다.

```yaml
# config.yaml

###############
# Mail Server #
###############
mail.backend: "smtp" # Use dummy if you want to disable email entirely
mail.host: "test.net"
mail.port: 25
mail.username: ""
mail.password: ""
mail.use-tls: false
# The email address to send on behalf of
mail.from: "sentry@test.net"
```

```py
# sentry.conf.py

ENV_CONFIG_MAPPING = {
  'SENTRY_EMAIL_PASSWORD': 'mail.password',
  'SENTRY_EMAIL_USER': 'mail.username',
  'SENTRY_EMAIL_PORT': ('mail.port', Int),
  'SENTRY_EMAIL_USE_TLS': ('mail.use-tls', Bool),
  'SENTRY_EMAIL_HOST': 'mail.host',
  'SENTRY_SERVER_EMAIL': 'mail.from',
  'SENTRY_ENABLE_EMAIL_REPLIES': ('mail.enable-replies', Bool),
  'SENTRY_EMAIL_LIST_NAMESPACE': 'mail.list-namespace',
  'SENTRY_SMTP_HOSTNAME': 'reply.getsentry.com',
  'SENTRY_SECRET_KEY': 'system.secret-key',
  'SENTRY_SMTP_HOST': '0.0.0.0',
  'SENTRY_SMTP_PORT': 1025,
  # If you're using mailgun for inbound mail, set your API key and configure a
  # route to forward to /api/hooks/mailgun/inbound/
  'SENTRY_MAILGUN_API_KEY': 'mail.mailgun-api-key',
}
```

다만, 본인의 경우 위의 방식처럼 tls옵션을 꺼도 계속 true로 표시가 되고, domain 주소가 바뀌지 않아서 직접 module 코드를 수정해 주었다.

```py
# 설치된 sentry 모듈에서 위의 파일경로를 찾아가서 직접 수정
...
def get_connection(fail_silently=False):
    """
    Gets an SMTP connection using our OptionsStore
    """
    return _get_connection(
        backend=get_mail_backend(),
        # host=options.get('mail.host'),
        # port=options.get('mail.port'),
        host='localhost',
        port=25,
        username=options.get('mail.username'),
        password=options.get('mail.password'),
        # use_tls=options.get('mail.use-tls'),
        use_tls=False,
        timeout=options.get('mail.timeout'),
        fail_silently=fail_silently,
    )
...
...
def send_messages(messages, fail_silently=False):
    connection = get_connection(fail_silently=fail_silently)

    # 아래의 로직은 from_email 주소를 특정 domain으로 수정하기 위한 작업
    for message in messages:
      message.from_email = 'sentry@test.net'

    sent = connection.send_messages(messages)
    metrics.incr('email.sent', len(messages), skip_internal=False)
    for message in messages:
        extra = {
            'message_id': message.extra_headers['Message-Id'],
            'size': len(message.message().as_bytes()),
        }
        logger.info('mail.sent', extra=extra)
    return sent
...
```

## Ubuntu 16 이상 버전의 systemd를 이용한 deamon 실행 (2020.09.13 내용추가)

`etc/systemd/system/` 경로에 service 수행을 위한 파일을 생성한다. 필자는 아래와 같은 명칭으로 생성하였다.(`sentry-web.service`, `sentry-cron.service`, `sentry-worker.service`)

```ps
# sentry-web.service
[Unit]
Description=Sentry Main Service
After=network.target
Requires=sentry-cron.service
Requires=sentry-worker.service

[Service]
Type=simple
User=sentry
Group=sentry
WorkingDirectory=/home/sentry/.venv/sentry
Environment=SENTRY_CONF=/home/sentry/.sentry
ExecStart=/home/sentry/.venv/sentry/bin/sentry run web
```

```ps
# sentry-worker.service
[Unit]
Description=Sentry Worker Service
After=network.target

[Service]
Type=simple
User=sentry
Group=sentry
WorkingDirectory=/home/sentry/.venv/sentry
Environment=SENTRY_CONF=/home/sentry/.sentry
ExecStart=/home/sentry/.venv/sentry/bin/sentry run worker
```

```ps
# sentry-cron.service
[Unit]
Description=Sentry Cron Service
After=network.target

[Service]
Type=simple
User=sentry
Group=sentry
WorkingDirectory=/home/sentry/.venv/sentry
Environment=SENTRY_CONF=/home/sentry/.sentry
ExecStart=/home/sentry/.venv/sentry/bin/sentry run cron
```

위와같이 파일에 내용을 등록한 후 아래의 명령어를 수행하여 service를 수행시킨다.

```ps
# systemctl 재호출
$ sudo systemctl daemon-reload

# 추가한 sentry service들 등록
$ sudo systemctl enable sentry-web
$ sudo systemctl enable sentry-worker
$ sudo systemctl enable sentry-cron

# 추가한 sentry service들 시작
$ sudo systemctl start sentry-worker
$ sudo systemctl start sentry-cron
$ sudo systemctl start sentry-web
```

위의 service 방법을 제외하고 다른 부분은 다른점이 없다.

> 내용에 틀린점이 있거나, 수정할 부분이 있다면 댓글로 피드백 부탁드립니다.
