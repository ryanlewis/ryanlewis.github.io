---
title: A small Lucene hook
layout: post
summary: A way to hook into Lucene when the index is being written
---
I haven't posted in a while, so I just wanted to add a quick hack I posted earlier 
on today in the [Umbraco Slack][1] channel.

The following is a small hook into Lucene that you can utilise in your Umbraco builds
to improve the usability and relevance of your search indexes.

There are a couple of things you can do at this stage. The example in the gist 
below skips the indexing of any document that is outside of the "Home" node &mdash; for
example, a settings or widget tree.

After that, I have a document I really want to appear at the top of my search
results, so I boost the score of those at the index stage.

You could also, for example, add
any supplementary data to your Lucene index which will then be searchable against 
that document (for example, keywords that belong to a parent document &mdash; add the
parent *category* keywords to the *product* page being indexed).

Now onto the code.

{% gist ryanlewis/66d207ecb6981055cf87 %}

[1]: https://github.com/tomfulton/umbraco-community-slack
