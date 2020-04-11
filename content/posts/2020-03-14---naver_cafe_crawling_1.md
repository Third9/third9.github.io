---
title: 네이버 카페 Crawling 하기-1:인증
date: "2020-03-14 14:51:13.943302"
template: "post"
draft: false
slug: "/posts/네이버_카페_crawling1/"
category: "develop"
tags:
  - "python3"
  - "pyppeteer"
  - "naver cafe"
  - "crawling"
  - "네이버 카페"
  - "크롤링"
description: "개발자 아빠의 어린이집 사진 수집하는 법"
---


## 네이버 카페 Crawling

아이의 어린이집에서 운영하는 카페에 매일 올라오는 사진을 매번 내려받기가 귀찮아서 네이버 카페 crawler를 만들게 되었다. 일주일에 몇 번씩 불규칙하게 올라오는 자녀의 사진을 저장하는 건 생각보다 많은 시간과 에너지를 소모한다.

주력으로 사용하는 python을 이용해서 처음에는 [`selenium`](https://www.selenium.dev)을 가져다가 손쉽게 만들 수 있을 것이라 생각했지만, 네이버의 인증은 생각보다 호락호락하지 않았다. 

selenium을 이용한 인증 방식은 모두 네이버 측에서 사람이 안한걸로 체크하고 걸러내더라, 사람이 하는 것처럼 키입력 방식과 딜레이를 두어도 다 걸러냈다. 그 와중에 알게 된 새로운 headless browser인 [`puppeteer`](https://github.com/puppeteer/puppeteer)를 사용해 봤는데 이건 잘되더라, node.js로 만들어져 있어서 언어를 js로 바꿔서 해야 하나 했는데... 이걸 python으로 포팅한 [`pyppeteer`](https://github.com/miyakogi/pyppeteer) 라는 비공식 프로젝트가 존재했다. 이제 python과 pyppeteer를 이용해서 crawler를 만들었던 내용을 정리한다.

## 브라우저 열어보기

>💡여기서 사용되는 html의 element의 위치를 특정하기 위한 값들은 언제든 네이버 측에서  변경하면 바뀔 수 있다. 여기 표기된 위치는 글 작성 시점에서의 path일 뿐 직접 코드를 수행할때는 달라질 수 있다. pyppeteer를 잘 사용하기 위해서는 browser 상에서 원하는 elem의 path를 잘 뽑아내는 것이 매우중요하다. 개인적으로는 크롬의 개발자 모드에서 elem path를 찾는 것을 추천한다.

우선 알아둬야할 부분이 pyppetter는 python 3.6 이상부터만 지원을 하는데, 그 이유로는 asyncio의 사용이 필수이기 떄문이다. github과 문서상에서 이유에 대한 내용을 찾지는 못했지만, 개인적으로는 node.js용으로 만들어진 puppeteer도 async/await 등의 비동기 형식으로 동작을 하기에 puppeteer를 포팅하여 만들어졌기에 이러한 부분에 영향을 받은 것으로 생각된다.

우선 python과 pyppeteer를 이용해서 기본적인 페이지를 열어보자.
```python
# main.py
import asyncio
from pyppeteer import launch


async def main():
  '''
  접속을 위한 browser 객체를 만든다. headless 옵션을 False로 하면 리모트용 크롬이 실행되어,
  실제 수행되는 과정을 확인하기 쉽다.
  pyppeteer용 method는 대부분 async/await 처리를 해줘야 한다.
  '''
  browser = await launch(headless=False)
  page = await browser.newPage()
  
  '''
  실제 사용자가 쓰는 browser 처럼 브라우저 버전, 상태정보들을 setting 해준다.
  '''
  await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
  # waitFor method는 pyppetter를 사용하게 된다면 아주 많이 사용하게 될거다. 1000은 1sec만큼 대기를 한다.
  await page.waitFor(1000)

  # goto method를 이용해서 원하는 page로의 이동이 가능하다. 여기선 www.naver.com로 이동한다.
  await page.goto('https://www.naver.com')
  await page.waitFor(1000)

if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
```

위의 `launch` 에 headless 옵션을 False로 주었기에 remote용 chrome 브라우저가 열리며 우리가 원하는 페이지로의 이동하는 작업을 화면으로 보여준다. 옵션을 True로 주었다면 동일한 기능을 하되 사용자는 UI 상으로 확인은 어렵다.

## Naver 인증 하기

일단 오픈된 웹사이트라면 모를까 인증을 거쳐야만 정보를 확인 할 수 있는 사이트라면 인증기능을 구현하는 것이 가장 선행되어야 할 작업이다. 위의 코드에 이어서 인증 부분만을 추가 구현해본다.
```python
# 여기서 page param은 위의 main method에서 전달받는다.
async def naver_auth(page):
  # 인증을 위한 naver 페이지로 이동
  await page.goto('https://nid.naver.com/nidlogin.login?mode=form&url=https%3A%2F%2Fwww.naver.com')
  await page.waitFor(1000)

  auth_id = "naver_id"
  auth_pw = "naver_pw"

  # naver 인증 페이지에서의 id/pw 입력 필드에 값을 입력한다.(해당 elem의 id값은 변경될 수도 있다.)
  await page.type('#id', auth_id, {'delay': 500})
  await page.type('#pw', auth_pw, {'delay': 500})

  await page.click('#frmNIDLogin > fieldset > input')
  await page.waitFor(1000)
```

여기까지만 하면 일단 인증은 된다. 다만 네이버 측에서는 새로운 기기로 인증이 되었다는 화면이 뜰거다.

그 부분은 아래와 같이 추가한다. 위의 naver_auth method에 이어서
```python
# login 후 해당 장치 인증
elems_login_and_device_add = await page.xpath('//*[@id="frmNIDLogin"]/fieldset/span[1]/a')
if len(elems_login_and_device_add) > 0:
  login_and_device_add = elems_login_and_device_add[0]
  await login_and_device_add.click()
  await page.waitFor(1000)

  # login 상태 유지 않함
  elems_login_persist = await page.xpath('//*[@id="login_maintain"]/span[2]/a')

  login_persist = elems_login_persist[0]
  await login_persist.click()
  await page.waitFor(1000)
```

위의 코드를 추가하면 된다. 그렇게 되면 naver_auth의 전체코드는 아래와 같다.
```python
async def naver_auth(page):
  # 인증을 위한 naver 페이지로 이동
  await page.goto('https://nid.naver.com/nidlogin.login?mode=form&url=https%3A%2F%2Fwww.naver.com')
  await page.waitFor(1000)

  auth_id = "naver_id"
  auth_pw = "naver_pw"

  # naver 인증 페이지에서의 id/pw 입력 필드에 값을 입력한다.(해당 elem의 id값은 변경될 수도 있다.)
  await page.type('#id', auth_id, {'delay': 500})
  await page.type('#pw', auth_pw, {'delay': 500})

  await page.click('#frmNIDLogin > fieldset > input')
  await page.waitFor(1000)

  # login 후 해당 장치 인증
  elems_login_and_device_add = await page.xpath('//*[@id="frmNIDLogin"]/fieldset/span[1]/a')
  if len(elems_login_and_device_add) > 0:
    login_and_device_add = elems_login_and_device_add[0]
    await login_and_device_add.click()
    await page.waitFor(1000)

    # login 상태 유지 않함
    elems_login_persist = await page.xpath('//*[@id="login_maintain"]/span[2]/a')

    login_persist = elems_login_persist[0]
    await login_persist.click()
    await page.waitFor(1000)
````

> 💡참고로 pyppetter를 사용하기 위해서는 내가 수행할 html의 elem의 위치를 정확히 체크해서 해당 자원을 선택할 수 있어야 한다. 나는 xpath를 선호하여 elem의 선택방식을 xpath 값으로 하였지만, 자원을 찾는 방식은 자유롭고 다양하다.

위의 코드에서는 login 상태가 유지되지 않도록 하였다. 여기까지 하였다면 pyppeteer를 이용하여 naver 인증을 마치는 부분 까지 완료됬다. 다만, 이렇게 하면 매번 headless browser를 이용하여 인증할때마다 아래와 같은 화면을 확인하거나, 새로운 기기에서 인증되었다는 메일이 날라올거다.

#### 새로운 기기에서 로그인하였다는 화면

![](/media/네이버_카페_크롤링1/0314_01.png)

이 화면이 매번 나오는 것이 싫다면, 브라우저의 설정 정보를 추가해야 한다. 위에서 초반에 `launch` method를 수행한 것을 기억할거다. 해당 method에 userDataDir param을 선언하고 해당 OS에 적합한 chrome이 설치된 파일 경로를 설정해주면 된다. [[관련문서](https://chromium.googlesource.com/chromium/src/+/master/docs/user_data_dir.md#Introduction)]
```python
# before
browser = await launch(headless=False)

# after
browser = await launch(headless=False, userDataDir={OS별 경로})
````

위와 같이 변경해주면, 처음을 제외하고는 다시 headless 를 실행할떄 새로운 기기인증과 관련한 화면이나 메일 발송없이 인증이 진행된다.

지금까지 진행된 내용의 전체 코드는 아래와 같다.
```python
# main.py
import asyncio
from pyppeteer import launch


async def naver_auth(page):
  # 인증을 위한 naver 페이지로 이동
  await page.goto('https://nid.naver.com/nidlogin.login?mode=form&url=https%3A%2F%2Fwww.naver.com')
  await page.waitFor(1000)

  auth_id = "naver_id"
  auth_pw = "naver_pw"

  # naver 인증 페이지에서의 id/pw 입력 필드에 값을 입력한다.(해당 elem의 id값은 변경될 수도 있다.)
  await page.type('#id', auth_id, {'delay': 500})
  await page.type('#pw', auth_pw, {'delay': 500})

  await page.click('#frmNIDLogin > fieldset > input')
  await page.waitFor(1000)

  # login 후 해당 장치 인증
  elems_login_and_device_add = await page.xpath('//*[@id="frmNIDLogin"]/fieldset/span[1]/a')
  if len(elems_login_and_device_add) > 0:
      login_and_device_add = elems_login_and_device_add[0]
      await login_and_device_add.click()
      await page.waitFor(1000)
  
      # login 상태 유지 않함
      elems_login_persist = await page.xpath('//*[@id="login_maintain"]/span[2]/a')
  
      login_persist = elems_login_persist[0]
      await login_persist.click()
      await page.waitFor(1000)

async def main():
  '''
  접속을 위한 browser 객체를 만든다. headless 옵션을 False로 하면 리모트용 크롬이 실행되어,
  실제 수행되는 과정을 확인하기 쉽다.
  pyppeteer용 method는 대부분 async/await 처리를 해줘야 한다.
  '''
  browser = await launch(headless=False)
  page = await browser.newPage()
  
  '''
  실제 사용자가 쓰는 browser 처럼 브라우저 버전, 상태정보들을 setting 해준다.
  '''
  await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
  # waitFor method는 pyppetter를 사용하게 된다면 아주 많이 사용하게 될거다. 1000은 1sec만큼 대기를 한다.
  await page.waitFor(1000)

  # goto method를 이용해서 원하는 page로의 이동이 가능하다.
  await page.goto('https://www.naver.com')
  await page.waitFor(1000)

  naver_auth(page)

if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())
````

여기까지로 naver에 접속해서 인증하는 부분까지는 pyppeteer 로 구현이 됬다. 이후의 naver cafe에 접근해서 글을 가져오고 저장하는 부분은 다음편에서 다루겠습니다.

> 📌내용이 잘못됬거나 변경된 사항이 있다면 코멘트 바랍니다.
