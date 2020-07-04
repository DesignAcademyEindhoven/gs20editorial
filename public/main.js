function loadData(category) {
    return globalThis.d3.json('../dictionary-' + category + '.json');
}

function getRandom(obj) {
    var keys = Object.keys(obj);
    return keys[keys.length * Math.random() << 0];
};

function randomColor() {
    var colors = ["#ffe862", "#77b740", "#5c93aa", "#c6ffcd"];
    var rand = Math.floor(Math.random() * colors.length);
    document.documentElement.style.setProperty('--highlite-color', colors[rand]);
};

function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}

(async () => {
    let dictionary = await loadData('bachelor');;
    parseDict();
    clickable();
    // randomColor();

    // change dictionary on click
    globalThis.d3.selectAll('.radio > input').on("click", async function () {
        let inputValue = this.value
        globalThis.d3.selectAll('.sentences > div').remove()
        globalThis.d3.selectAll('#searchOutput > span').remove()
        globalThis.d3.selectAll('#grammarOutput > div').remove()
        globalThis.d3.selectAll('#grammarMenu > span').remove()
        globalThis.d3.selectAll('.reoccuringWords > div > div').remove()


        dictionary = await loadData(inputValue);
        parseDict();
        clickable();
        // randomColor();

    });


    function parseDict() {
        console.log(dictionary)

        for (let i in dictionary) {
            // It appends categories to menu

            if ('SPACE' == i || 'PUNCT' == i) {
                continue
            }
            else {
                globalThis.d3.select('#grammarMenu')
                    .append('span')
                    .attr('attr', i)
                    .text(i);

                globalThis.d3.select('.reoccuringWords > div')
                    .append('div')
                    .attr('attr', i)
                    .text(i);
            }
            //  appends most reoccuring words to divs
            let dict = dictionary[i];
            let keys = Object.keys(dictionary[i]);
            keys.sort((key1, key2) => {
                let len1 = dict[key1].length;
                let len2 = dict[key2].length;
                if (len1 === len2) {
                    return key2.toLowerCase() < key1.toLowerCase() ? 1 : -1;
                }
                return len2 - len1;
            });

            //  It appends to div the first n reoccuring words
            keys.slice(0, 30).forEach((key) => {
                globalThis.d3.select('.reoccuringWords div[attr=' + i + ']')
                    .append('div')
                    .html('<small> ' + dict[key].length + '</small>' + '<p>' + capitalize(key) + '</p>')

            });

        }

        for (let i = 0; i < 30; i++) {
            globalThis.d3.select('.sentences')
                .append('div')
                .text(getRandom(dictionary['ADJ']) + ' ' + getRandom(dictionary['PROPN']) + ' ' + getRandom(dictionary['VERB']) + ' ' + getRandom(dictionary['DET']) + ' ' + getRandom(dictionary['NOUN']));
        }


        // write random words
        globalThis.d3.selectAll('#grammarMenu > span').on("click", function () {
            globalThis.d3.select('#grammarOutput')
                .append('div')
                .text(getRandom(dictionary[this.innerText]) + ' ');
        });
    }


    const button = document.querySelector('#searchWord');

    button.addEventListener('click', function () {
        let inputText = document.getElementById("search").value.toLowerCase();
        // parses dictionary to find a matching key
        console.log(inputText)
        for (let i in dictionary) {
            for (let j in dictionary[i]) {
                if (dictionary[i][inputText]) {
                    let uniqueName = [...new Set(dictionary[i][inputText])];
                    let catGram = i;
                    if (dictionary[i][inputText].length == 1) {
                        console.log(dictionary[i][inputText], catGram, uniqueName)
                        globalThis.d3.select('#searchOutput')
                            .append('span')
                            .text(inputText + '(' + catGram + ') is mentioned only once by: ' + uniqueName);
                        break
                    }
                    if (dictionary[i][inputText].length > 1) {
                        console.log(dictionary[i][inputText], catGram, uniqueName)
                        globalThis.d3.select('#searchOutput')
                            .append('span')
                            .text(inputText + '(' + catGram + ') is mentioned ' + dictionary[i][inputText].length + ' times by: ' + uniqueName);
                        break
                    }
                }
            }
        }
    });

    const clean = document.querySelector('#emptyGrammar');
    clean.addEventListener('click', function () {
        globalThis.d3.selectAll('#grammarOutput > *').remove()

    });


    function clickable() {

        // create random sentences
        globalThis.d3.selectAll('#generateSentences').on("click", function () {
            globalThis.d3.select('.sentences')
                .append('div')
                .lower()
                .text(getRandom(dictionary['ADJ']) + ' ' + getRandom(dictionary['PROPN']) + ' ' + getRandom(dictionary['VERB']) + ' ' + getRandom(dictionary['DET']) + ' ' + getRandom(dictionary['NOUN']));
        });

        // write random words
        globalThis.d3.selectAll('#grammarMenu > span').on("click", function () {
            if (document.getElementById('grammarOutput').children.length > 0) {
                for (let i = 0; i < 10; i++) {
                    globalThis.d3.select('#grammarOutputLine' + i)
                        .append('div')
                        .style('display', 'inline')
                        .text(getRandom(dictionary[this.innerText]) + ' ');
                }

            } else {
                for (let i = 0; i < 10; i++) {
                    globalThis.d3.select('#grammarOutput')
                        .append('div')
                        .attr('id', 'grammarOutputLine' + i)
                        .text(getRandom(dictionary[this.innerText]) + ' ');
                }
            };
        });

    }
})();