function getTableOfContents(){
    if (document.getElementById("toc")){
        const toc = document.getElementById("toc");
        const title = document.createElement("p");
        title.innerText = "Contenidos:";
        toc.appendChild(title);
        const headings = document.querySelectorAll("h2, h3, h4, h5, h6");
        const levels = getLevels(headings); // From highest (inner) to lowest (outer)
        const baseLevel = levels.slice(-1);
        const baseHeading = "H" + baseLevel;
        let previousItem = levels.slice(-1)-1;
        let sublistNumber = 0;
        for (const [index, heading] of headings.entries()){
            let row = document.createElement("li");
            row.innerText = `${heading.innerText}`;
            heading.setAttribute("data-title", `t${index}`); // So it's compatible with headings having an ID already
            row.setAttribute("data-heading", `t${index}`);
            row.setAttribute("onclick", "document.querySelector(`[data-title='${this.dataset.heading}']`).scrollIntoView()");
            let currentItem = heading.tagName.slice(-1);
            if (heading.tagName !== baseHeading && index > 0)
                previousItem = headings[index-1].tagName.slice(-1);
            if (currentItem === previousItem && currentItem !== baseLevel)
                document.getElementById(`sublist${sublistNumber}-${heading.tagName}`).appendChild(row);
            else {
                let newList = document.createElement("ul");
                if (heading.tagName === baseHeading)
                    sublistNumber++;
                if (document.getElementById(`sublist${sublistNumber}-${heading.tagName}`)) 
                    document.getElementById(`sublist${sublistNumber}-${heading.tagName}`).removeAttribute("id");
                // To ensure child always appends to the closest parent 
                newList.setAttribute("id", `sublist${sublistNumber}-${heading.tagName}`);
                newList.appendChild(row);
                let itemAdded = false;
                for (let i of levels.slice(levels.indexOf(parseFloat(currentItem))+1)){
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
                    toc.appendChild(newList);
            }
        }
    }
}   

function getLevels(nodeList){
    let itemSet = new Set;
    for (const item of nodeList)
        itemSet.add(item.tagName);
    let endings = [...itemSet].map(item => parseFloat(item.slice(-1)));
    return endings.sort().reverse();
}