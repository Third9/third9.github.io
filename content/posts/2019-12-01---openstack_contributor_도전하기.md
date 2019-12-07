---
title: openstack contributor 도전
date: "2019-12-01 10:18:45.704249"
template: "post"
draft: false
slug: "/posts/openstack_contributor_도전/"
category: "develop"
tags:
  - "openstack"
  - "git"
  - "contributor"
description: "Openstack을 사용하면서 코드를 내가 수정한 부분을 openstack에 반영 했던것에 대한 정리글입니다."
---

>오픈스택을 공부하면서 간단한 철자 오류를 수정하고 싶어서 github에 올렸더니 contributor가 되려면 그냥 PR 하는 방법이 아닌 여러가지 단계를 거치기에 직접 시도해 본 내용을 글로 남깁니다.

처음에는 일반적인 github 방식대로 Fork 한 뒤에 수정해서 PR을 했더니 PR 글 밑에 아래와 같은 답변을 줬습니다.

```
Thank you for contributing to openstack/cinder!

openstack/cinder uses Gerrit for code review.

If you have never contributed to OpenStack before make sure you have read the getting started documentation: http://docs.openstack.org/infra/manual/developers.html#getting-started

Otherwise please visit http://docs.openstack.org/infra/manual/developers.html#development-workflow and follow the instructions there to upload your change to Gerrit.
````

그래서 설명대로 링크를 찾아가 보니, 뭔가 엄청 많고 불친절한 영어의 압박...
내용을 읽어보면 우선 `lunchpad`에 계정을 등록하라고 합니다.

>contributer 를 위해서는 코드리뷰를 해야 하는데 코드리뷰 시스템에 사용되는 계정이 open id 를 이용하기 때문에 그걸 등록해야 한다.

[lunchpad 링크](https://login.launchpad.net)로 이동해서 회원가입을 하고, 회원가입도 했으면 이제 https://review.openstack.org/ 로 이동합니다.
여기 가서 오른쪽 상단을 보면 로그인 할 수 있게 되어있고, `open id` 에 로그인이 된 상태면 손쉽게 로그인이 가능합니다.

> 아래의 순서대로 진행하면 됩니다.
> 1. 로그인 후에 오른쪽 상단의 이름을 선택하면 `setting` 버튼이 있습니다.
> 2. `setting` 화면에서 `profile`탭에 `username`을 등록하고, `contact information`은 내 개인정보를 등록하면 됩니다.
> 3. `ssh public keys`탭으로 이동해서 공용키를 등록하고, 없으면 터미널에서 `ssh-keygen` 을 실행하면 됩니다.
> `(*공용키 생성부터 등록까지의 방법도 해당 탭에 "How to Generate an SSH Key" 라는 이름으로 잘 설명되 있습니다.)`
>
> 4. `Agreements`탭으로 이동해서 개인용 인증 라이센스를 발급 받으면 코드리뷰를 위한 기본 계정 생성 작업은 끝납니다.


그 다음 부터는 맨 위에서 나온 getting-started 가이드를 보면서 다시 진행하면 됩니다.
```shell
git config --global user.name xxxxx
```
설명 그대로 진행해서 git 전역 환경설정에 이름과 주소를 등록합니다.
여기까지 했으면 이제 `git-review`를 설치합니다, 설치 방법은 자신의 환경 및 선호도에 따라서 다양하게 나와있습니다.
이제 여기 까지 잘 됬는지 확인을 해보죠 아래의 명령어를 터미널에서 입력합니다.

```shell
#shell
ssh -p 29418 {username}@review.openstack.org
# {username} 위치에는 아까 코드리뷰 등록할때 만든 username을 등록해야 한다.
```

잘됬으면 Welcome 어쩌구 저쩌구 하는 환영의 메시지가 나옵니다.
그럼 이제 원하는 프로젝트를 골라서 git으로 다운받으면 됩니다.
```shell
git clone ssh://{username}@review.openstack.org:29418/{repo project name}
```
내가 원하는 프로젝트 이름을 입력했는데 안되면 해당 [링크](https://review.openstack.org/#/admin/projects/) 로 들어가서 검색하면 됩니다.
해당 repo를 다운받은 뒤에 디렉토리로 이동해서 아래의 명령어를 입력해 줍니다.
```shell
git review -s
```
명령어를 입력하면, 공용키 비밀번호를 입력하라고 나옵니다.

> 에러가 발생한 경우
>```shell
>git remote add gerrit ssh://{username}@review.openstack.org:29418/{repo project name}
>```

그 이후에는 아래의 명령어 입력
```shell
git remote update
```
우선 브랜치를 새로 생성하고요 [링크 참조](https://docs.openstack.org/infra/manual/developers.html#starting-a-change)
```shell
git checkout -b {브랜치명}
```
브랜치 명은 보통 `bp/{내용}` 형태로 하는듯 한데, review 사이트를 가보면 각각 다릅니다, 최대한 링크의 설명대로 맞춰서 작성하죠.
코드를 다 수정했으면 그 이후에는
```shell
git commit -a
```
를 통해서 수정된 내역을 커밋. 커밋 로그 작성 방식은 위의 링크를 참조합니다.

커밋을 하였으면 `git show`명령어를 이용하여 커밋이 됬는지 확인 후 `git review`명령어를 실행하면 되는데, 
아래와 같은 에러가 나오는 경우가 있습니다.
```
fatal: ICLA contributor agreement requires current contact information.

Please review your contact information:

  https://review.openstack.org/#/settings/contact

fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

이런 경우는 openstack review 사이트의 `setting`항목에서 `contact inforamtion` 이 등록되어 있지 않아서, 그런 경우로 해당 경로로 이동해서 간단하게 메일주소와 국가를 입력해서 저장 하면됩니다.
잽싸게 등록하고 아무문제 없이 저장이 된경우 `git review` 명령어를 실행하면...
```
remote: Processing changes: new: 1, refs: 1, done
remote:
remote: New Changes:
remote:   https://review.openstack.org/xxxxxx your commit msg
remote:
To ssh://yourname@review.openstack.org:29418/openstack/cinder
 * [new branch]      HEAD -> refs/publish/master/bp/branch
 ```
위와 같은 이런저런 review사이트에 등록되었다는 메시지가 나옵니다.(개인내용은 임의로 수정했습니다.)

하지만 `contact information` 저장에서 `Code Review - Error server error` 에러가 나온다면 해당 
[링크](https://ask.openstack.org/en/question/56720/cannot-store-contact-information-when-updating-info-in-openstack-gerrit/)를 참조합니다. 
openstack.org 에서 계정이 등록되어있지 않아서 그런 경우로 review 사이트와 동일한 email 주소로 등록을 해줍니다.

`git review` 실행 후 나온 review사이트 주소로 들어가면 본인이 등록한 review글이 보이고, 
처음 등록한 경우에는 reviewers 명단에 `Welcome, new contributor!` 라는 메시지가 나옵니다. 

성공적으로 작동 후 결과가 나오는 데는 시간이 조금 걸립니다. 다시 수정해야 하는 경우.
review시스템에 등록한 상태에서 다른 CI들과 함께 jenkins가 테스트를 한 뒤 승인을 하는데,
테스트에서 실패가 발생하는 경우 코드를 다시 수정해서 올릴 수 있습니다.

에러가 난 코드를 확인 한 뒤 `git commit -a --amend` 명령어를 이용해서 다시 커밋하고,
`git review` 로 review시스템에 다시 등록하면 됩니다.
