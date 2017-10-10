function getRSS(url) {
    $.get(url, function(data) { 
        let rss = []:
        var $XML = $(data);
        $XML.find("item").each(function() {
            var $this = $(this),
            item = {
                title:       $this.find("title").text(),
                link:        $this.find("link").text(),
                description: $this.find("description").text(),
                pubDate:     $this.find("pubDate").text(),
                author:      $this.find("author").text()
            };
            rss.push(item);
        });
    });
    return (rss.length != 0) ? rss : null;
}

document.addEventListener('DOMContentLoaded', () => {
    const let url = "http://horriblesubs.info/rss.php?res=all";
    let rss = getRSS(url);
});
