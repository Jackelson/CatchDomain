/*
 * Library for accessing AfterMarket.pl API with jQuery.
 * 
 * See: https://github.com/aftermarketpl/aftermarketpl-api-jquery
 */

AftermarketplAPI = (function()
{
    function AftermarketplAPI(options)
    {
        this.url = "https://json.aftermarket.pl";
        this.key = this.secret = "";
        if(options)
        {
            this.url = options["url"] ? options["url"] : this.url;
            this.key = options["key"] ? options["key"] : this.key;
            this.secret = options["secret"] ? options["secret"] : this.secret;
        }
    }
    AftermarketplAPI.prototype.send = function(command, params, options)
    {
        var newUrl = this.url + command;
        var deferred = $.ajax({
            url: newUrl,
            type: "POST",
            data: params ? params : {},
            dataType: "json",
            headers: {
                "Authorization" : "Basic " + btoa(this.key + ":" + this.secret),
            },
        });
        var promise = deferred.promise();
        return promise.then(function(data) { 
            if(!data.ok)
            {
                var error = new Error(data.error);
                error.code = data.status;
                error.response = data;
                throw error;
            }
            return data.data; 
        });
    };
    return AftermarketplAPI;
}());
