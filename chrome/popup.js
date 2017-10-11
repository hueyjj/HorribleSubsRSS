function loadRSS(url) {
    $.get(url, function(data) { 
        let rss = [];
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

        let table = convertToTable(rss);
        load(table);
    });
}

//TODO Simply list down with same names and put magnet links in the same row
function convertToTable(rss) {
    if (rss.length > 0) {
        let table = document.createElement("table");
        table.className = "rss-table";

        rss.forEach(function(item) {
            let row = document.createElement("tr");
            row.className = "rss-row";
            row.insertCell(-1);
            row.insertCell(-1);


            let title = document.createTextNode(rss.title);
            title.className = "rss-title";

            let magnet = document.createTextNode(rss.link);
            magnet.className = "rss-magnet";

            row.appendChild(title);
            row.appendChild(magnet);
            
            table.insertRow(-1);
            table.appendChild(row);
        });
        return table;
    }
    else return null;
}

function load(table) {
    if (table != null) {
        // load new rss html document
        document.body.appendChild(table);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const url = "http://horriblesubs.info/rss.php?res=all";
    loadRSS(url);
});
