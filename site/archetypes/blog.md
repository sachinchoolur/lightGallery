---
title: "{{ replace .Name "-" " " | title }}"
description: ""
excerpt: ""
date: {{ .Date }}
lastmod: {{ .Date }}
draft: true
weight: 50
images: ["{{ .Name | urlize }}.jpg"]
categories: [""]
---

{{< img src="{{ .Name | urlize }}.jpg" alt="{{ replace .Name "-" " " | title }}" caption="{{ replace .Name "-" " " | title }}" class="wide" >}}
