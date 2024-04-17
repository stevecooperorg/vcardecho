# vcardecho

## a workaround to the problem of iphones not handling vcards in NFC tags

If you want to share your contact info via an NFC card, you quickly run into a problem - iPhones won't read vCards from NFC tags. Which is no good. But, there is a way around it. The _can_ follow hyperlinks, and a hyperlink can point to a vCard file, and now you're back in business.

So, if you can host your `.vcf` file somewhere, and allow people to download it, that's it - you're done.

However, two things;

- you might not want to manage a web server 
- you might not want your information to be publicly downloadable at all times

`vcardecho` is a clever-clever workaround. 

It is a website with a couple of pages;

1. an upload page where you can upload a vcard file and it'll convert it to a URL. This is the URL you write to your NFC tags.
2. an endpoint that responds to the URLs by downloading the content you uploaded in (1).

The neat bit is that I don't hold onto the data you uploaded in (1) - it's encoded into a format called base64 and given back to you. (I may remove any big binary blobs, like photos, because NFC tags only have a small amount of storage)

So, you get to give out the URL, the file isn't available publicly for web scraping, and we work around Apple's infuriating limit!

Here's what you need to do;

1. In the iphone contacts app, open the vcard and click 'share contact'
2. choose 'save to Files' and choose a suitable name like `firstname-lastname`
3. Open the vcard website
4. Click the upload button and upload the file
5. copy-paste the URL returned
6. Use an NFC writer like the 'NFC Tools' app to write your URL.
7. Network, baby!



First, you prepare a data 'payload' -- imagine you want to send this file;

```
{
    "name": "Steve",
    "job": "hacker"
}
```

you can encode it as a base64 string;

```
$ cat examples/payload.json

ewogICJuYW1lIjogIlN0ZXZlIiwKICAiam9iIjogImhhY2tlciIKfQ==
```

Then you make up a URL which contains that data;

```
GET http://localhost:7071/api/vcardecho?contentType=application/json&filename=payload.json&body=ewogICJuYW1lIjogIlN0ZXZlIiwKICAiam9iIjogImhhY2tlciIKfQ==
```

Now, when you open that link in a browser, `vcardecho` echos back the data you give it - it creates a download with the right response body and content type. 

And that's it! 

- you've got your vcard file
- you didn't need to store anything on the web or make anything public
- you don't need to host your own website -- you can use mine. Although it's open source so go ahead and host it yourself.

I used [this tutorial from Microsoft](https://docs.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-node) which'll explain how to host this in Microsoft Azure.


