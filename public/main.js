function loadData(category) {
    return globalThis.d3.json('../dictionary-' + category + '.json');
}

function getRandom(obj) {
    var keys = Object.keys(obj);
    return keys[keys.length * Math.random() << 0];
};

function randomColor() {
    let mainColor = ["#F115AF", "#F33C1A", "#002AFC", "#8b0000", "#D1D1D1", "#D1D1D1"];
    let complementaryColor = ["#8b0000", "#D1D1D1", "#000000", "#F115AF", "#F33C1A", "#002AFC"];
    let rand = Math.floor(Math.random() * mainColor.length);
    console.log(rand)
    document.documentElement.style.setProperty('--highlite-color', mainColor[rand]);
    document.documentElement.style.setProperty('--main-color', complementaryColor[rand]);
};


function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}

(async () => {
    randomColor();
    let dictionary = await loadData('bachelor + master');;
    parseDict();
    clickable();

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
        randomColor();

    });


    function parseDict() {

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
            keys.slice(0, 50).forEach((key) => {
                globalThis.d3.select('.reoccuringWords div[attr=' + i + ']')
                    .append('div')
                    .html('<small> ' + dict[key].length + '</small>' + '<p>' + capitalize(key) + '</p>')

            });

        }

        let sentences = []

        for (let i = 0; i < 30; i++) {
            sentences.push(getRandom(dictionary['ADJ']) + ' ' + getRandom(dictionary['NOUN']) + ' ' + getRandom(dictionary['VERB']) + ' ' + getRandom(dictionary['NOUN']))
            globalThis.d3.select('.sentences')
                .append('div')
                .text(getRandom(dictionary['ADJ']) + ' ' + getRandom(dictionary['NOUN']) + ' ' + getRandom(dictionary['VERB']) + ' ' + getRandom(dictionary['NOUN']));
        }


        // write random words
        globalThis.d3.selectAll('#grammarMenu > span').on("click", function () {
            globalThis.d3.select('#grammarOutput')
                .append('div')
                .text(getRandom(dictionary[this.innerText]) + ' ');
        });


        var phrase = document.getElementById("description");
        var t = setInterval(step, 100);
        var passaggi;
        let mode;
        var current = -1;
        swap();

        function step() {
            if (mode == 0) {
                var end = sentences[current].length;
                var start = end - passaggi - 1;
                phrase.innerHTML = sentences[current].slice(start, end);
                passaggi++;
                if (passaggi == sentences[current].length) {
                    mode++;
                    passaggi = 0;
                }
            } else if (mode == 1) {
                passaggi++;
                if (passaggi == 80) swap();
            }
        }

        function swap() {
            do {
                var r = Math.floor(Math.random() * sentences.length);
            } while (r == current);
            current = r;
            passaggi = 0;
            mode = 0;
            phrase.innerHTML = "";
        }
    }

    const button = document.querySelector('#searchWord');

    button.addEventListener('click', function () {
        let inputText = document.getElementById("search").value.toLowerCase();
        // parses dictionary to find a matching key
        for (let i in dictionary) {
            for (let j in dictionary[i]) {
                if (dictionary[i][inputText]) {
                    let uniqueName = [...new Set(dictionary[i][inputText])];
                    let catGram = i;
                    if (dictionary[i][inputText].length == 1) {
                        globalThis.d3.select('#searchOutput')
                            .append('span')
                            .text(inputText + '(' + catGram + ') is mentioned only once by: ' + uniqueName + ' ');
                        break
                    }
                    if (dictionary[i][inputText].length > 1) {
                        globalThis.d3.select('#searchOutput')
                            .append('span')
                            .text(inputText + '(' + catGram + ') is mentioned ' + dictionary[i][inputText].length + ' times by: ' + uniqueName.join(', '));
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
                .text(getRandom(dictionary['ADJ']) + ' ' + getRandom(dictionary['NOUN']) + ' ' + getRandom(dictionary['VERB']) + ' ' + getRandom(dictionary['NOUN']));
        });

        // write random words
        globalThis.d3.selectAll('#grammarMenu > span').on("click", function () {
            if (document.getElementById('grammarOutput').children.length > 0) {
                for (let i = 0; i < 50; i++) {
                    globalThis.d3.select('#grammarOutputLine' + i)
                        .append('div')
                        .style('display', 'inline')
                        .text(getRandom(dictionary[this.innerText]) + ' ');
                }

            } else {
                for (let i = 0; i < 50; i++) {
                    globalThis.d3.select('#grammarOutput')
                        .append('div')
                        .attr('id', 'grammarOutputLine' + i)
                        .text(getRandom(dictionary[this.innerText]) + ' ');
                }
            };
        });

    }
})();