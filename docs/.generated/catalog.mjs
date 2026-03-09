export const nav = [
  {
    "text": "首页",
    "link": "/"
  },
  {
    "text": "分类",
    "link": "/categories/"
  },
  {
    "text": "下载 ZIP",
    "link": "https://gitea.example.com/your-user/skills-repo/archive/main.zip"
  }
];
export const sidebar = {
  "/categories/": [
    {
      "text": "分类",
      "items": [
        {
          "text": "Coding",
          "link": "/categories/coding"
        },
        {
          "text": "Devops",
          "link": "/categories/devops"
        }
      ]
    }
  ],
  "/skills/": [
    {
      "text": "Coding",
      "collapsed": false,
      "items": [
        {
          "text": "python-debug",
          "link": "/skills/coding/python-debug"
        }
      ]
    },
    {
      "text": "Devops",
      "collapsed": false,
      "items": [
        {
          "text": "docker-helper",
          "link": "/skills/devops/docker-helper"
        }
      ]
    }
  ]
};
