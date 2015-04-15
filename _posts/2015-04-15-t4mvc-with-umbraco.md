---
title: "T4MVC with Umbraco"
layout: post
summary: "With other strongly-typed approaches, eliminate magic strings altogether"
published: true
---

## Strongly-typed Umbraco

After the community moved on from code-first Umbraco, three options remain for developers keen to leverage strongly-typed models within their classes. I wrote about [Umbraco Mapper][1] on Medium [last year][2], and [Ditto][3] has been getting a lot of mindshare recently. At Epiphany we are big fans of [Zbu.ModelsBuilder][4], which my colleague Tom Pipe blogged about [last year][5]. 

They are all approaches a developer can use to get strongly-typed models for use in their controllers and views without resorting to literal strings with `@Model.Content.GetPropertyValue<string>("propertyName")` calls littered throughout your templates. 

The one place that I still use literal strings in my projects is with my liberal use of partial views. 

```c#
@Html.Partial("Partials/Navigation")

@foreach (var profile in profiles) 
{
    Html.RenderPartial("Partials/Profile", profile);
}
```

These strings cause all sorts of headaches when you make typos or start renaming partials. You won't find out about these errors until runtime. In some complex scenarios, you might not catch all these issues through testing. This isn't a problem that is unique to Umbraco - ASP.NET MVC suffers from these same issues.

## T4MVC

I'll just shamelessly borrow the description from the [GitHub][7] page.

> T4MVC is a [T4 template][6] for ASP.NET MVC apps that creates strongly typed helpers that eliminate the use of literal strings in many places.

I won't cover everything that T4MVC does here, you should check out the [GitHub][7] page for that. After installing in your project (and the [companion VS extension][8]), you can solve the problem above with an automatically generated strongly-typed helper.

```c#
@Html.Partial(MVC.Views.Partials.Navigation)

@foreach (var profile in profiles) 
{
    Html.RenderPartial(Mvc.Views.Partials.Profile, profile);
}
```

Now the original problems disappear. If you mistype the partial name or rename a partial, your controllers won't compile. You can enjoy IntelliSense while writing your templates.

## BeginUmbracoForm

You will still end up using literal strings if you are using SurfaceControllers and `Html.BeginUmbracoForm` for your form submissions. T4MVC gets around the problem with the standard `Html.BeginForm` helper by providing extension methods in the T4MVCExtensions assembly ([see here][9]).

The following snippet can be used to leverage the generated T4MVC code and avoid literal strings.

```c#
public static class UmbracoExtensions
{
    public static MvcForm BeginUmbracoForm(this HtmlHelper htmlHelper, ActionResult result, FormMethod formMethod)
    {
        var callInfo = result.GetT4MVCResult();
        return htmlHelper.BeginUmbracoForm(callInfo.Action, callInfo.Controller, formMethod);
    }
}
```

This will allow you to use the BeginUmbracoForm method like below (assuming you have a SurfaceController called `ContactFormController` with an action called `Submit`)
  
```c#
@using (Html.BeginUmbracoForm<ContactFormModel>(MVC.ContactForm.Submit(), FormMethod.Post))
{
    @Html.TextBoxFor(m => m.Name)
}
```

There are some gotchas with forms and T4MVC, so make sure you read the [documentation][11].

You will have to create an override for each BeginUmbracoForm method [you wish to use][10] however.

## Links

* [UmbracoMapper][1]
* [Ditto][3]
* [Zbu.ModelsBuilder][4]
* [T4MVC][7]

[1]:https://github.com/AndyButland/UmbracoMapper
[2]:https://medium.com/umbraco-cms/using-umbracomapper-to-fully-embrace-mvc-b004e6755f64
[3]:https://github.com/leekelleher/umbraco-ditto
[4]:https://github.com/zpqrtbnk/Zbu.ModelsBuilder
[5]:http://blog.tompipe.co.uk/post/Adventures-with-Umbraco-and-ZbuModelsBuilder.aspx
[6]:https://msdn.microsoft.com/en-us/library/bb126445.aspx
[7]:https://github.com/T4MVC/T4MVC
[8]:https://visualstudiogallery.msdn.microsoft.com/8d820b76-9fc4-429f-a95f-e68ed7d3111a
[9]:https://github.com/T4MVC/T4MVC/wiki/Documentation#226-htmlbeginform
[10]:https://github.com/umbraco/Umbraco4Docs/blob/6293754487232edd17a9278df31083eb76096a9f/Documentation/Reference/Templating/Mvc/forms.md#beginumbracoform-overloads
[11]:https://github.com/T4MVC/T4MVC/wiki/Documentation#226-htmlbeginform
