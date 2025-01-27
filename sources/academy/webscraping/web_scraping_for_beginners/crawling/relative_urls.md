---
title: Relative URLs
description: Learn about absolute and relative URLs used on web pages and how to work with them when parsing HTML with Cheerio in your scraper.
sidebar_position: 4
slug: /web-scraping-for-beginners/crawling/relative-urls
---

# Relative URLs {#filtering-links}

**Learn about absolute and relative URLs used on web pages and how to work with them when parsing HTML with Cheerio in your scraper.**

---

You might have noticed in the previous lesson that while printing URLs to the DevTools console, they would always show in full length, like this:

```text
https://warehouse-theme-metal.myshopify.com/products/denon-ah-c720-in-ear-headphones
```

But in the Elements tab, when checking the `<a href="...">` attributes, the URLs would look like this:

```text
/products/denon-ah-c720-in-ear-headphones
```

What's up with that? This short version of the URL is called a **relative URL**, and the full length one is called an **absolute URL**.

> [Learn more about absolute and relative URLs](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL#absolute_urls_vs._relative_urls).

We'll see why the difference between relative URLs and absolute URLs is important a bit later in this lesson.

## Browser vs Node.js: The Differences {#browser-vs-node}

Let's update the Node.js code from the [Finding links lesson](./finding_links.md) to see why links with relative URLs can be a problem.

```js title=crawler.js
import { gotScraping } from 'got-scraping';
import cheerio from 'cheerio';

const storeUrl = 'https://warehouse-theme-metal.myshopify.com/collections/sales';

const response = await gotScraping(storeUrl);
const html = response.body;

const $ = cheerio.load(html);

const productLinks = $('a.product-item__title');

for (const link of productLinks) {
    const url = $(link).attr('href');
    console.log(url);
}
```

When you run this file in your terminal, you'll immediately see the difference. Unlike in the browser, where looping over elements produced absolute URLs, here in Node.js it only produces the relative ones. This is bad, because we can't use the relative URLs to crawl. They simply don't include all the necessary information.

## Resolving URLs {#resolving-urls}

Luckily, there's a process called resolving URLs that creates absolute URLs from relative ones. We need two things. The relative URL, such as `/products/denon-ah-c720-in-ear-headphones`, and the URL of the website where we found the relative URL (which is `https://warehouse-theme-metal.myshopify.com` in our case).

```js
const websiteUrl = 'https://warehouse-theme-metal.myshopify.com';
const relativeUrl = '/products/denon-ah-c720-in-ear-headphones';

const absoluteUrl = new URL(relativeUrl, websiteUrl);
console.log(absoluteUrl.href);
```

In Node.js, when you create a `new URL()`, you can optionally pass a second argument, the base URL. When you do, the URL in the first argument will be resolved using the URL in the second argument. Note that the URL created from `new URL()` is an object, not a string. To get the URL in a string format, we use the `url.href` property, or alternatively the `url.toString()` function.

When we plug this into our crawler code, we will get the correct - absolute - URLs.

```js title=crawler.js
import { gotScraping } from 'got-scraping';
import cheerio from 'cheerio';

// Split the base URL from the category to use it later.
const WEBSITE_URL = 'https://warehouse-theme-metal.myshopify.com';
const storeUrl = `${WEBSITE_URL}/collections/sales`;

const response = await gotScraping(storeUrl);
const html = response.body;

const $ = cheerio.load(html);

const productLinks = $('a.product-item__title');

for (const link of productLinks) {
    const relativeUrl = $(link).attr('href');
    // Resolve relative URLs using the website's URL
    const absoluteUrl = new URL(relativeUrl, WEBSITE_URL);
    console.log(absoluteUrl.href);
}
```

Cheerio can't resolve the URL itself, because until you provide the necessary information - it doesn't know where you originally downloaded the HTML from. The browser always knows which page you're on, so it will resolve the URLs automatically.

## Next up {#next}

The [next lesson](./first_crawl.md) will teach you how to use the collected URLs to crawl all the individual product pages.
