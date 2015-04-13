---
title: 'Introducing SEO Metadata for Umbraco'
layout: post
summary: 'A new property editor for use within Umbraco v7.1+'
---

SEO Metadata for Umbraco is a property editor that is used for maintaining common SEO-related information for a page. It gives users a visual representation of how the page would look on a Google search result page and hints to when the title and description is too long, with optional validation. 

![SEO Metadata for Umbraco](https://raw.githubusercontent.com/ryanlewis/seo-metadata/master/images/example1.gif)

It also provides some common SEO-related options that we frequently require on our pages, such as the ability for a user to conveniently amend the URL segment (in other words, the page slug), as well as flag a page as "noindex" to robots. Brief usage comments are added to prompt content editors to use ideal content for SEO, with links to resources on [Moz.com](http://moz.com/).

This property editor has been in use at [Epiphany][1] for sometime, so I've packaged it up and made it publically available. To install Epiphany.SeoMetadata, run the following command in the [Package Manager Console][3].

```
Install-Package Epiphany.SeoMetadata
```

I love to know how you get on with it. Please let me know if you have any issues or suggestions by contacting me on [Twitter](https://twitter.com/wpyz) or by submitting an [issue on GitHub](https://github.com/ryanlewis/seo-metadata/issues).

* [Project on GitHub][2]
* [Package on NuGet][4]



[1]:http://www.epiphanysearch.co.uk
[2]:https://github.com/ryanlewis/seo-metadata
[3]:http://docs.nuget.org/consume/package-manager-console
[4]:https://www.nuget.org/packages/Epiphany.SeoMetadata/