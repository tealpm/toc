
# Table of Contents

It's a function that looks for an id "toc" in an HTML page and populates it with a hierarchical list of all the headings previously loaded in the page, if any.

This code is based on one created for a microblog, so that some long or complicated posts could have a table of contents. 



## Features

- If the headings already have a value for the id attribute, it will not be overwritten.

- The next list level in the TOC is always the next one in the hierarchy regardless of the HTML tag. For example, if the text jumps from an h2 to an h4, the list will display the h4 as an h3.


## Demo

A folder with some sample HTML texts has been created.


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Contributing

It is very likely the code can be better than how it is when published. Contributions are always welcome!


## Installation

There are two options to link this JavaScript code to an HTML page:

- Copypaste the code inside a <script> element of a HTML page.

- Add the file URL as value of the src attribute of a <script> element of a HTML page (or equivalent).

With a few modifications, it could be converted into a module to import.

## Deployment

Please note the actual text with the HTML heading tags (h2, h3...) must be loaded before the script runs. Therefore, the script tag should be placed after the text or the function called once the text has loaded.

One can customise the title, the list type and the headings range. The default values are, respectively: "Contents", unordered list (ul) and h2-h6.
    

## Lessons Learned

Learnings:

- Converting to the right data type (int vs str) was relevant to solve some issues.

- I found out about immediately invoked functions.

Challenges:

- Variables needed to be remembered by different parts of the code. The chosen structure is certainly improvable.

- I intended to use the language built-in attributes for the links in the TOC. However, I could not make scrossY, offsetTop or similar to work properly. I ended up dynamically generating a dataset ID to each heading & then scrollIntoView sends there.


#### Readme created in readme.so 
Thanks
