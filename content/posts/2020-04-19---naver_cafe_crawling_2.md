---
title: '네이버 카페 Crawling 2: cafe글 가져오기'
date: "2020-04-19 01:45:24.995529"
template: "post"
draft: false
slug: "/posts/네이버_카페_crawling2/"
category: "develop"
tags:
  - "python3"
  - "pyppeteer"
  - "naver cafe"
  - "crawling"
  - "네이버 카페"
  - "크롤링"
description: "개발자 아빠가 아이의 사진을 관리하는 법"
---

> 이전글 보기 [네이버 카페 Crawling 1: cafe 인증](/posts/네이버_카페_crawling1)

이전 글에서 pyppetter를 이용해서 카페 인증 및 화면 이동까지 설명했었다. 여기서는 카페에서 글 목록을 가져오고, 해당 글에서 내용(이미지)를 가져오는 부분을 다루도록 한다.

필자의 경우 자녀의 카페 사진을 가져오기 위해서 해당 프로그램을 만들었기에 글 목록과 글의 이미지 정도의 내용 만으로도 충분하지만, 더 많은 정보를 가져오고 싶다면 여기서 다루는 내용을 응용하여 충분히 원하는 정보를 추출 할 수 있다고 본다.

## Step 1: 카페 게시글 화면 이동

>💡해당 글에서 설명하는 코드에 있는 xpath의 위치 및 selector 경로는 모두 chrome의 개발자 도구를 통해서 확인 하고 찾은 값이다. 추후에 경로가 달라진다면 개발자 도구 등을 이용하여 위치를 찾으면 된다.

전의 글에 이어서 인증을 하였다면, 이제 원하는 카페의 글들을 가져오기 위해서 해당 카페의 페이지로 이동을 하여야 한다.
```python {numberLines}
# 페이지 이동
## cafe_url에는 본인이 이동하고자 하는 url 주소를 입력하면 된다.
await page.goto(cafe_url)
await page.waitFor(1000)
```

위의 코드로 원하는 카페의 페이지로 이동이 가능하다. 잘 모르겠다면 이전 글을 참조하자.

## Step 2: 카페 게시글의 이미지 가져오기

카페의 이미지를 가져오기 위해서는 내가 원하는 글이 있는 링크를 위해서 표현한대로 `page.goto(게시글 URL)`방식을 통해서 이동하면 된다.
`page` 객체에 현재 내가 접근한 page의 정보들이 모두 들어있기에 위에서 이동한 `page` 객체를 이용해야 한다.

네이버 카페는 사이드의 목록정보와 본문글이 frame으로 각기 나뉘어 있기에 본문이 있는 frame에 접근한 후에글의 내용을 가져와야 한다.
```python {numberLines}
# 카페 메인 프레임 선택
## pyppeteet를 이용하여 elems을 가져올때는 return 되는 type은 기본적으로 list(array) 형태를 띈다.
main_frame = [frame for frame in page.frames if frame.name == 'cafe_main'][0]
```

위의 형태로 본문이 있는 main frame에 접근하여서 `main_frame` 객체에게서 글의 내용 제목등을 가져올 수 있다. 

아래의 코드를 참조하자.
```python {numberLines}
''' 
main-frame에서 xpath 상으로 class명이 tit-box인 element 목록을 추출한다.
해당 class elem에 글의 제목 및 title에 위치하는 관련정보들이 존재한다.'''
elem_title_box = await main_frame.xpath('//*[@class="tit-box"]')
# 위의 목록에서 실제 element를 가져온다.(xpath 등과 같이 element 정보를 가져오면 모두 list형태를 띈다)
title_box = elem_title_box[0]

# 해당 query에 만족하는 elem의 Text를 가져온다.(여기선 게시글의 제목)
article_title = await title_box.Jeval('div.fl tbody span.b.m-tcol-c', 'node => node.innerText')
```
여기서 위의 코드를 보면 `Jeval` method가 존재한다. 이는 기존에 `document.querySelector` 와 같은 기능을 하는데, 다른점은 해당 기능을 수행 후  `eval` 기능을 수행한다.

>💡Pyppetter문서에서는 `Jeval` 에 대해서 아래와 같이 설명합니다.
>`Jeval(selector: str, pageFunction: str, *args) → Any`  
>alias to querySelectorAllEval()

위의 코드에서 게시글의 제목을 가져오는건 필자가 목적했던 바의 부수적인 부분이다, 필자의 주 목적인 이미지들을 가져오는 기능이 필요하다.
```python {numberLines}
# main_frame 객체에서 게시글의 본문내용을 가지고 있는 tbody라는 id를 가진 elem을 가져옵니다.
elem_body = await main_frame.xpath('//*[@id="tbody"]')

# 해당 tbody안에 속한 모든 image elem을 가져와서 주소와 id 객체를 가지는 list 형태로 return 합니다.
article_imgs = await elem_body.JJeval('img', '(nodes) => nodes.map(n => { return { src: n.src, name: n.id }})')
await page.waitFor(1000)
```
위의 코드를 통해서 tbody안에 있는 모든 img elem 들의 src 주소와 id 정보를 가져올 수 있다. 위의 코드에는 아까 `Jeval` 과 비슷한 `JJeval` method가 보이는데 차이는 `Jeval` 이 찾아진 여러개의 elem들 중에서 첫번째의 elem만 가져온다면, `JJeval`은 모든 elem들을 가져온다는 것이다.

>💡Pypetter 문서에서는 `JJeval`에 대해서 아래와 같이 설명합니다.
`JJeval(selector: str, pageFunction: str, *args) → Optional[Dict[KT, VT]]`

여기까지만 읽어보았어도 위의 코드들을 응용하여 게시글의 원하는 내용들을 Crawling 하는데 문제가 없다고 생각한다.

다만, 필자의 경우 게시글 하나가 아닌 여러개의 글을 가져와야 했기에 게시글 목록을 가져오는 내용까지 같이 설명하기로 한다.

## Step3: 카페 게시글 목록 가져오기

카페 게시글 목록 페이지에 접근해서 해당 글들을 가져오면 되는데 한가지 문제가 있다.

아래의 이미지는 카페 게시글 목록의 상단에 위치한 elem을 캡쳐한 모습인데, 각 카페 게시글마다 운영진의 설정에 따라서 기본 셋팅이 다르다.

![](/media/네이버_카페_크롤링2/0419_1.png)

네이버 카페의 게시판은 위의 이미지와 같이 카드, 영상, 앨범, 리스트 등의 형태로 볼 수 있게 되어있고 카페별로 기본 형태가 달라서 가져오기 편하고 한화면에 최대한 많은 글들이 보일 수 있도록 변경해줘야 다음작업을 수행하기에 편하다. 카페의 글을 가져오기 전에 선행작업을 통해서 카페글을 최대한 많이 가져올 수 있는 형태로 바꾸자, 먼저 목록 스타일부터 변경해준다.
```python {numberLines}
# 글 목록이 존재하는 cafe_main frame을 가져옵니다.
main_frame = [frame for frame in page.frames if frame.name == 'cafe_main'][0]

# 해당 frame에서 위의 목록 스타일 정보를 가지는 elem을 가져옵니다.
elem_list_style = await main_frame.xpath('//*[@id="main-area"]/div[@class="list-style"]')

# 우리는 List 스타일을 원하니 list elem객체를 가져와서 click 합니다.
elem_btn_sort_list = await elem_list_style[0].J('.sort_area .sort_form .sort_list')
await elem_btn_sort_list.click();
await page.waitFor(1500)
```
여기서 위의 코드를 보면 `J` method가 존재하는데, 이는 `document.querySelector` 와 같은 기능을 한다.

목록 스타일을 List 형태로 바꾸었으면, 게시물이 가장 많이 나오는 갯수로 변경을 한다.
```python {numberLines}
# 목록의 출력 갯수를 표시하는 elem을 선택합니다.
elem_page_size = await main_frame.xpath('//*[@id="listSizeSelectDiv"]/a')
await elem_page_size[0].click();
await page.waitFor(1000)

# 카페의 목록형식에서 50개씩 나오기 선택
elem_50_page = await main_frame.xpath('//*[@id="listSizeSelectDiv"]/ul/li[7]/a')
await elem_50_page[0].click();
```
위의 작업까지 했다면 이제 게시물 출력 스타일이 리스트 형태에 게시글을 50개씩 보인다.

이제 여기서 게시글의 목록을 가져와서 해당 게시글들의 URL 주소를 가져온다.
```python {numberLines}
# 페이지의 목록들 가져오기
elem_trs = await main_frame.xpath('//*[@id="main-area"]/div[@class="article-board m-tcol-c"]/table/tbody/tr')
await page.waitFor(1000)

article_urls = []
for idx, tr in enumerate(elem_trs):
  tr_article = await tr.Jeval('.td_article .board-list .article',
                        'node => { return { href: node.href, title: node.innerText } }')
  article_urls.append(tr_article.get('href'))
```
위에서 나오 코드들을 응용하면, 더 다양한 정보의 추출이 가능하고, 위에서 Crawling한 내용들을 DB와 파일형태로 관리한다면 주기적으로 원하는 정보를 수집할 수 있는 자동화 서비스를 만들기에도 수월하다고 생각한다.

> 📌내용이 잘못됬거나 변경된 사항이 있다면 코멘트 바랍니다.
