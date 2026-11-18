---
layout: home.njk
title: die website von junienet
permalink: /index.html
---

{% for post in collections.posts | reverse %}
  <h1><a href="{{ post.url }}">{{ post.data.title }} ({{ post.date | date("yyyy-MM-dd") }})</a></h1>
  {% excerpt post %}
{% endfor %}
