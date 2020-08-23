const fs = require('fs');

const NewPost = () => {
    let datetime = new Date().toISOString();
    let today = datetime.split('T')[0];
    const filePath = './content/posts/';
    const fileName = today + '---NEW-POST.md'
    const content = "---\n"
                    + "title: 'NEW POST'\n"
+ `date: ${datetime} \n`
+ "template: \"post\"\n"
+ "draft: false\n"
+ "slug: \"/posts/NEW_POST/\"\n"
+ "category: \"develop\"\n"
+ "tags:\n"
+ "  - \"tag\"\n"
+ "description: \n"
+  "---"
    fs.writeFile(filePath+fileName, content, (err) => {
        if (err) throw err;
        console.log('Created New Post Template');
    })
}
NewPost()