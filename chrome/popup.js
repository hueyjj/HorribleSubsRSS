//function save(rss) {
//    if (rss.length < 1) return;
//
//    // Save number of items
//    chrome.storage.sync.set({"numItems": rss.length}, function() {
//        console.log(rss.length + " items saved");
//    });
//
//    // Save each item
//    rss.forEach(function(item, i) {
//        let key = "item" + ' ' + i;
//        chrome.storage.sync.set({[key]: item}, function() {
//            //console.log(key + ' ' + "saved");
//        });
//    });
//}
//
//function get() {
//    let items = null;
//    chrome.storage.sync.get("numItems", function(item) {
//        if (item) items = item.numItems;
//    });
//
//    console.log("number of items " + items);
//    if (items && items > 0) {
//        let rss = [];
//        for (let i = 0; i < items; ++i) {
//            let key = "item" + ' ' + i;
//            chrome.storage.sync.get(key, function(item) {
//                if (!chrome.runtime.error) {
//                    console.log(item);
//                    rss.push(item);
//                }
//                else {
//                    console.log(chrome.runtime.lastError.message);
//                }
//            });
//        }
//    }
//
//    return (items) ? rss : null;
//}

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

        //chrome.storage.sync.clear(() => {
        //    if (!chrome.runtime.error) {
        //        console.log("successfully cleared storage");
        //    }
        //    else {
        //        console.log(chrome.runtime.lastError.message);
        //    }
        //});

        let table = convertToTable(rss);
        load(table);
    });
}

//TODO Simply list down with same names and put magnet links in the same row
function convertToTable(rss) {
    if (rss.length > 0) {
        rss.sort(function(a, b){
            let stringA = a["title"].toLowerCase(), stringB = b["title"].toLowerCase();
            return (stringA < stringB) ? -1:
                   (stringA > stringB) ?  1: 0; 
        });
        let table = document.createElement("table");
        table.className = "rss-table";

        rss.forEach(function(item) {
            let row = table.insertRow(-1);
            row.className = "rss-row";

            let titleCell = row.insertCell(-1),
                magnetCell = row.insertCell(-1);

            let title = document.createTextNode(item["title"]);
            title.className = "rss-title";

            let magnetSpan = document.createElement("span"),
                magnetRefLink = document.createElement("a");
            magnetSpan.className = "rss-link";
            magnetRefLink.title = "Magnet Link";
            magnetRefLink.href = item["link"];
            magnetRefLink.innerText = item["title"].includes("1080p")   ? "1080p" :
                                      item["title"].includes("720p")    ? "720p" :
                                      item["title"].includes("480p")    ? "480p" : "???p";
            magnetSpan.appendChild(magnetRefLink);

            magnetSpan.onclick = function () { chrome.tabs.create({url: item["link"], selected: false}) };

            titleCell.appendChild(title);
            magnetCell.appendChild(magnetSpan);
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
    // Close tab when after magnet link has opened
    chrome.tabs.onCreated.addListener(function(tab) {
        chrome.tabs.remove(tab.id);
    });
    const url = "http://horriblesubs.info/rss.php?res=all";
    loadRSS(url);
});
