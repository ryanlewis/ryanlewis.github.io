---
title: "Placeholder content with Umbraco"
layout: post
summary: "Handling placeholder content within a page"
published: true
---

I've already mentioned before about our use of Stefan's [Models Builder](https://github.com/zpqrtbnk/Zbu.ModelsBuilder), and this is geared for users of that. 

We had a requirement where the top of the page contained a blurb asking users to pick up the phone and contact them. There were two phone numbers, 
depending on whether you were calling from a landline or a mobile phone. 

> Call 0800 111 222 to speak to one of our team (01234 567 890 from a mobile)

This was within the base template of a page (so it was shown on every page). Pretty standard stuff.The problem was that the phone numbers could change in the 
future. The page was also responsive, so the phone numbers were clickable `tel:` links on mobile phones.

We handled this problem by allowing the user to input the whole sentence and use placeholders within the string, which would later be replaced with the actual 
phone numbers for the site. This was stored as a standard Richtext editor, and the editor was instructed to use `{Phone}` in the place of the actual phone number.
We configured the markup and left it. Editors only had to change the copy if they saw fit.

When rendering the page, the string {Phone} was replaced with the phone number for the site, using a `String.FormatWith()` extension method. The one we use was adopted
from the [one blogged by Ben Scott](http://bendetat.com/the-greatest-string-formatwith-implementation-in-the-world.html) with some minor adjustments to handle cases where 
an editor removes all placeholders (a version of what we use is available in this [gist](https://gist.github.com/ryanlewis/ad28c52bc31aa5e32647)).

Within our settings node (entitled `ContactSettings`), we had our `CallUsTemplate` richtext property containing placeholders, and two other fields for the phone number and mobile number.
With Zbu Models Builder and `String.FormatWith`, we provided our view with a new property marrying the two together.

```c#
public IHtmlString CallUsSubstituted
{
    get
    {
        var callUsTemplate = CallUsTemplate.ToString();

        var callUsString = callUsTemplate.FormatWith(new { Phone, Mobile });
        return new HtmlString(callUsString);
    }
}
```
	
Obtain a copy of your `ContactSettings` node, ensure it's strongly cast to your Models Builder object, and you get your expected content.

## Overrides on individual pages

Another requirement came through where the phone number had to be different for certain pages (these were landing pages as part of a PPC campaign). The PPC landing
pages required a different phone number to the rest of the site so that the client could gauge the success of their PPC campaign (using a service like
[ResponseTap](https://www.responsetap.com/) or [Infinity](https://www.infinitycloud.com/)).

The anonymous object passed to the `String.FormatWith` method was replaced with some interim code that swapped the numbers for a version contained on the page. On this 
occasion we checked to see if `UmbracoContext.Current.PublishedContentRequest.PublishedContent` (the current document) was an instance of `IMixinPhoneNumberOverride`
(the interface that Zbu Models Builder added for our mixin, "Mixin | Phone Number Override"). We then swapped in the properties from the mixin, and our
templates are kept clean and logic-free.

## Future

I would really like to see placeholder content become a first-class concept with Umbraco, becoming part of the main Umbraco pipeline. I want to see an editor
to be able to manage content and place their placeholders in. This may come with future **Persona** support (it's called something different with Umbraco - the 
persona term relates to SiteCore). 
