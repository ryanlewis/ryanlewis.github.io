---
title: Umbraco Contour 3 in Flexible Load Balanced environments
layout: post
summary: Have legacy Umbraco Contour installations work correctly in modern Umbraco load-balanced environments
---

I didn't want to go a whole year without updating this site, so here's a little note on a problem that I resolved this morning.

I was in a situation where an Umbraco site was regularly patched, and we recently patched it to the latest version of the 7.4 patch. This was in a load balanced environment, so the servers were reconfigured to use flexible load balancing, as detailed in the [Umbraco documentation](https://our.umbraco.org/documentation/getting-started/setup/server-setup/load-balancing/).

However, it is running Umbraco Contour v3 (now named Umbraco Forms), which is no longer maintained. In this new load balanced scenario, all the servers were not being made aware of any changes to a form during runtime, and each server had to be restarted in order to clear the cache. Forms are regularly maintained on this website, so we had to come up with a better solution.

This wasn't a problem in previous Umbraco versions as Contour would talk to other servers, and each would update their cache accordingly. However, this was no longer working, as we are now using a different mechanism to update server caches, and Contour v3 was end of life.

The solution was to hook into the save events within Umbraco Contour, and then distribute a cache refresh instruction using the new mechanism introduced in 7.3.

```c#
public class ContourFormSync : ApplicationEventHandler
{
    protected override void ApplicationStarted(UmbracoApplicationBase umbracoApplication,
        ApplicationContext applicationContext)
    {
        // listen to contour forms being saved
        Umbraco.Forms.Data.Storage.FormStorage.FormCreated += DistributeCacheInstruction;
        Umbraco.Forms.Data.Storage.FormStorage.FormUpdated += DistributeCacheInstruction;
    }

    internal static void DistributeCacheInstruction(object sender, FormEventArgs e)
    {
        var refresherGuid = Guid.Parse(ContourFormCacheRefresher.Id);
        var payload = ContourFormCacheRefresher.SerializeToJsonPayload(new ContourFormRefreshPayload {Id = e.Form.Id});
        DistributedCache.Instance.RefreshByJson(refresherGuid, payload);
    }
}

public class ContourFormRefreshPayload
{
    public Guid Id { get; set; }
}
```

This will create a `ContourFormCacheRefresher` instruction, which will then get picked up by the other servers. When another server picks up this instruction, we want it to refresh the internal Umbraco Contour cache.

```c#
public class ContourFormCacheRefresher : JsonCacheRefresherBase<ContourFormCacheRefresher>
{
    public static string Id = "AA2970FD-8785-42C2-A289-A7A6614CAE45";
    protected override ContourFormCacheRefresher Instance => this;
    public override Guid UniqueIdentifier => new Guid(Id);
    public override string Name => "Clears Contour form cache";

    public override void Refresh(string json)
    {
        // ignore the payload for now - we're just wiping the form cache completely
        Umbraco.Forms.Core.Services.CacheService.ClearAllCache();
    }

    internal static ContourFormRefreshPayload[] DeserializeFromJsonPayload(string json)
    {
        var serializer = new JavaScriptSerializer();
        return serializer.Deserialize<ContourFormRefreshPayload[]>(json);
    }

    internal static string SerializeToJsonPayload(params ContourFormRefreshPayload[] payloads)
    {
        var serializer = new JavaScriptSerializer();
        var json = serializer.Serialize(payloads);
        return json;
    }
}
```

This can be improved, so that only the cached items are cleared from the cache instead of it all being completely nuked, but this works for now, and form updates are only a semi-regular occurrence.

This code is also available in a [gist](https://gist.github.com/ryanlewis/3b3266316765caa9c74be981cf9dcd2a).
