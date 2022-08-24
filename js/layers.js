addLayer("re", {
    name: "rewards",
    symbol: "Re",
    row: "side",
    tooltip: "Rewards",
    tabFormat: {
        "Rank": {
            content: [
                "blank",
                ["raw-html", () => {
                        let html = ""
                        for (let id in RANKS) {
                            let data = RANKS[id]
                            if (data.display)
                                if (data.display()) {
                                    html += "<div><h3>" + data.title + "</h3><br>" + data.info()
                                    html += "</div><br><br>"
                                }
                        }
                        return html
                    }]
            ]
        },
        "Tier": {
            content: [
                "blank",
                ["raw-html", () => {
                        let html = ""
                        for (let id in TIERS) {
                            let data = TIERS[id]
                            if (data.display)
                                if (data.display()) {
                                    html += "<div><h3>" + data.title + "</h3><br>" + data.info()
                                    html += "</div><br><br>"
                                }
                        }
                        return html
                    }]
            ]
        }
    }
})
