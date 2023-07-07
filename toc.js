
/*
Requirements in the HTML: 
- an empty element like a <div> with the id="toc"
- the HTML heading elements must load before this function
*/ 

(function(){
    if (document.getElementById("toc")){
        const HEADINGS = document.querySelectorAll("h2, h3, h4, h5, h6");
        if (HEADINGS.length > 0){
            let getLevels = function(nodeList){ 
                let itemSet = new Set;
                for (const item of nodeList)
                    itemSet.add(item.tagName);
                let endings = [...itemSet].map(item => parseFloat(item.slice(-1)));
                return endings.sort().reverse(); // From highest (inner) to lowest (outer)
        }
            const TOC = document.getElementById("toc");
            let addTitle = function(text){
                const TITLE = document.createElement("p");
                TITLE.innerText = text;
                TOC.appendChild(TITLE);
            }
            const LEVELS = getLevels(HEADINGS); 
            const BASE_LEVEL = parseInt(LEVELS.slice(-1));
            const BASE_HEADING = "H" + BASE_LEVEL;
            let previousItem = parseInt(LEVELS.slice(-1))-1;
            let sublistNumber = 0;
            let setRow = function(row, index, heading){
                row.innerText = `${heading.innerText}`;
                heading.setAttribute("data-title", `t${index}`); // So it's compatible with HEADINGS having an ID already
                row.setAttribute("data-heading", `t${index}`);
                row.setAttribute("onclick", "document.querySelector(`[data-title='${this.dataset.heading}']`).scrollIntoView()");
            } 
            let createList = function(nodeList){
                for (const [index, heading] of nodeList.entries()){
                    let row = document.createElement("li");
                    setRow(row, index, heading);
                    let currentItem = parseInt(heading.tagName.slice(-1));
                    if (heading.tagName !== BASE_HEADING && index > 0)
                        previousItem = parseInt(HEADINGS[index-1].tagName.slice(-1));
                    if (currentItem === previousItem && currentItem !== BASE_LEVEL) // Sibling row
                        document.getElementById(`sublist${sublistNumber}-${heading.tagName}`).appendChild(row);
                    else {
                        if (heading.tagName === BASE_HEADING)
                            sublistNumber++;
                        if (document.getElementById(`sublist${sublistNumber}-${heading.tagName}`)) 
                            document.getElementById(`sublist${sublistNumber}-${heading.tagName}`).removeAttribute("id");
                        // To ensure child always appends to the closest parent 
                        let newList = document.createElement("ul");
                        newList.setAttribute("id", `sublist${sublistNumber}-${heading.tagName}`);
                        newList.appendChild(row);
                        let itemAdded = false;
                        for (let i of LEVELS.slice(LEVELS.indexOf(parseFloat(currentItem))+1)){
                            if (document.getElementById(`sublist${sublistNumber}-H${i}`)){
                                let parentList = document.getElementById(`sublist${sublistNumber}-H${i}`);
                                if (currentItem > previousItem)
                                    parentList.appendChild(newList); 
                                // If levels are skipped, ul-indent is NOT bigger (ex: if H4 after H2, it will look like an H3)
                                else if (currentItem < previousItem)
                                    parentList.append(newList);
                                itemAdded = true;
                                break;
                            }
                        }
                        if (!itemAdded)
                            TOC.appendChild(newList);
                    }
                }
            }
            addTitle("Content");
            createList(HEADINGS);
        }
    }
}());