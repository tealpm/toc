
/*
Requirements in the HTML: 
- an empty element like a <div> with the id="toc"
- the HTML heading elements must load before this code, so generateTOC() has been added to a DOMContentLoaded event
*/

let TOC;
let HEADINGS;

document.addEventListener("DOMContentLoaded", generateTOC);

function generateTOC() {
    TOC = document.getElementById("toc");
    HEADINGS = document.querySelectorAll("h2, h3, h4, h5, h6");
    if (TOC != null && HEADINGS.length > 0) {
        addTitle("Content");
        createList();
    }
};

function addTitle(text) {
    const TITLE = document.createElement("p");
    TITLE.innerText = text;
    TOC.append(TITLE);
}

function createList() {
    const levels = getLevelsInDescendingOrder();
    const parentLevels = getParentLevels(levels);
    const topLevel = parseInt(levels.slice(-1));
    let tag, row, list, currentLevel, previousLevel, parentList;
    let sublistNumber = 0;
    for (const [index, heading] of HEADINGS.entries()) {
        tag = heading.tagName;
        previousLevel = (index !== 0) ? currentLevel : topLevel - 1;
        currentLevel = parseInt(tag.slice(-1));
        row = document.createElement("li");
        setRow(row, index, heading);
        if (currentLevel === previousLevel && currentLevel !== topLevel) {
            document.getElementById(`sublist${sublistNumber}-${tag}`).appendChild(row);
        }
        else {
            sublistNumber = (tag === `H${topLevel}`) ? sublistNumber + 1 : sublistNumber;
            list = createSublist(tag, index, sublistNumber, row);
            parentList = getClosestParent(parentLevels, currentLevel, sublistNumber);
            parentList.lastElementChild.appendChild(list);
        }
    }
}

function getLevelsInDescendingOrder() {
    const itemSet = new Set;
    for (const item of HEADINGS)
        itemSet.add(item.tagName);
    const endings = [...itemSet].map(item => parseFloat(item.slice(-1)));
    return endings.sort().reverse();
}

function getParentLevels(descendingLevels) {
    const parentLevels = [];
    let currentLevel;
    for (let i = 0; i < descendingLevels.length; i++) {
        currentLevel = descendingLevels[i];
        parentLevels[currentLevel] = descendingLevels.slice(descendingLevels.indexOf(parseFloat(currentLevel)) + 1);
    }
    return parentLevels;
}

function setRow(row, index, heading) {
    row.innerText = `${heading.innerText}`;
    heading.setAttribute("data-title", `t${index}`); // So it's compatible with HEADINGS already having an ID
    row.setAttribute("data-heading", `t${index}`);
    row.setAttribute("onclick", "document.querySelector(`[data-title='${this.dataset.heading}']`).scrollIntoView()");
}

function createSublist(tag, position, number, row) {
    const identifier = `sublist${number}-${tag}`;
    // To ensure child always appends to the closest parent | cb = "changed by" a certain heading
    if (document.getElementById(identifier))
        document.getElementById(identifier).id = `${identifier}-cb${position}`;
    const newList = document.createElement("ul");
    newList.setAttribute("id", identifier);
    newList.appendChild(row);
    return newList;
}

function getClosestParent(parentLevels, level, listNumber) {
    if (parentLevels.length > 0) {
        for (const i of parentLevels[level]) {
            if (document.getElementById(`sublist${listNumber}-H${i}`)) {
                return document.getElementById(`sublist${listNumber}-H${i}`);
            }
        }
    }
    return TOC;
    // If levels are skipped, ul-indent is NOT bigger (ex: if H4 after H2, it will look like an H3)
}