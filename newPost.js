const fs = require("fs");

const NewPost = () => {
  const datetime = new Date().toISOString();
  const today = datetime.split("T")[0];
  const filePath = "./content/posts/";
  const fileName = `${today}---NEW-POST.md`;
  const content = `---
title: 'NEW POST'
date: ${datetime}
template: "post"
draft: false
slug: "/posts/NEW_POST/"
category: "develop"
tags:
  - "tag"
description:
---`;

  fs.writeFile(filePath + fileName, content, err => {
    if (err) throw err;
    console.log("Created New Post Template");
  });
};
NewPost();
