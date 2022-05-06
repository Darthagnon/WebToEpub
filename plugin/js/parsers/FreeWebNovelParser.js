"use strict";

parserFactory.register("freewebnovel.com", () => new FreeWebNovelParser());

class FreeWebNovelParser extends Parser {

    constructor() {
        super();
    }

    async getChapterUrls(dom, chapterUrlsUI) {
        return this.getChapterUrlsFromMultipleTocPages(dom,
            FreeWebNovelParser.extractPartialChapterList,
            FreeWebNovelParser.getUrlsOfTocPages,
            chapterUrlsUI
        );
    }

    static getUrlsOfTocPages(dom) {
        // lastUrl should be example https://freewebnovel.com/<some-novel-name>/<index>.html
        let lastUrl = dom.querySelectorAll(".page a.index-container-btn")[3].href;
        let lastTocIndex = lastUrl.lastIndexOf("/");
        let lastIndexPageName = lastUrl.substring(lastTocIndex + 1);
        let lastIndex = parseInt(lastIndexPageName.substr(0, lastIndexPageName.length - ".html".length));
        let urls = [];
        let tocHasMultiplePages = !isNaN(lastIndex);
        if (tocHasMultiplePages) {
            let baseUrl = lastUrl.substring(0, lastTocIndex + 1);
            for (let i = 2; i <= lastIndex; ++i) {
                urls.push(baseUrl + i + ".html");
            }
        }
        return urls;
    }

    static extractPartialChapterList(dom) {
        return [...dom.querySelector(".m-newest2").querySelectorAll("ul li a")]
            .map(a => util.hyperLinkToChapter(a));
    }

    extractTitleImpl(dom) {
        return dom.querySelector("h1.tit");
    }

    extractAuthor(dom) {
        return dom.querySelector("[title=Author]").parentNode.querySelector("a").textContent;
    }

    extractSubject(dom) {
        let tags = [...dom.querySelector("[title=Genre]").parentNode.querySelectorAll("a")];
        return tags.map(e => e.textContent.trim()).join(", ");
    }

    findCoverImageUrl(dom) {
        return util.getFirstImgSrc(dom, "div.pic");
    }

    findChapterTitle(dom) {
        return dom.querySelector("span.chapter");
    }

    findContent(dom) {
        return dom.querySelector("div.txt");
    }

    getInformationEpubItemChildNodes(dom) {
        return [...dom.querySelectorAll("div.inner")];
    }
}
