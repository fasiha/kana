/*
This is the most complicated-but-not-mad way to build a table of
hiragana, katakana, and roumaji. I build the table programmatically
using Javascript and Unicode fiends, and then display it in the
browser using D3.js.
*/

// Build the roumaji table
var consonants = "-kstnhmyrw`";
var vowels = "aiueo";

var roumaji_table = Array();
for (var cidx = 0; cidx < consonants.length; cidx++) {
    roumaji_table[cidx] = Array();
    for (var vidx = 0; vidx < vowels.length; vidx++) {
        var c = consonants[cidx];
        var v = vowels[vidx];
        var val = c + v;
        if (c == '-') {
            val = v;
        }
        if (c == '`') {
            if (v == 'a') {
                val = 'n';
            } else {
                val = "";
            }
        }
        roumaji_table[cidx][vidx] = val;
    }
}

var mod = function(cons, vow, val) {
    roumaji_table[consonants.indexOf(cons)][vowels.indexOf(vow)] = val;
};

mod('s', 'i', 'shi');
mod('t', 'i', 'chi');
mod('t', 'u', 'tsu');
mod('h', 'u', 'fu');

mod('y', 'i', "");
mod('y', 'e', "");

mod('w', 'i', "");
mod('w', 'u', "");
mod('w', 'e', "");

// Unicode to build the hiragana table
var hira_table = Array();
for (cidx = 0; cidx < consonants.length; cidx++) {
    hira_table[cidx] = Array();
    for (vidx = 0; vidx < vowels.length; vidx++) {
        hira_table[cidx][vidx] = "";
    }
}

// See http://symbolcodes.tlt.psu.edu/bylanguage/japanesecharthiragana.html
var hira_table_starts = {
    "-" : 12354,
    k : 12363,
    s : 12373,
    t : 12383,
    n : 12394,
    h : 12399,
    m : 12414,
    y : 12420,
    r : 12425,
    w : 12431,
    '`' : 12435
};

var hira = function(cons, fn) {
    var cidx = consonants.indexOf(cons);
    hira_table[cidx] = hira_table[cidx].map(fn);
};

hira('-', function(val, idx) { return hira_table_starts['-'] + 2 * idx; });
hira('k', function(val, idx) { return hira_table_starts.k + 2 * idx; });
hira('s', function(val, idx) { return hira_table_starts.s + 2 * idx; });
hira('t',
     function(val, idx) { return hira_table_starts.t + 2 * idx + (idx >= 2); });
hira('n', function(val, idx) { return hira_table_starts.n + idx; });
hira('h', function(val, idx) { return hira_table_starts.h + 3 * idx; });
hira('m', function(val, idx) { return hira_table_starts.m + idx; });
hira('y', function(val, idx) { return hira_table_starts.y + idx; });
hira('r', function(val, idx) { return hira_table_starts.r + idx; });
hira('w', function(val, idx) { return hira_table_starts.w + (idx != 0) * 3; });
hira('`', function(val, idx) { return hira_table_starts['`']; });

// See http://symbolcodes.tlt.psu.edu/bylanguage/japanesechartkatakana.html
var kata_start = 12450;
var diff_hira_kata = kata_start - hira_table_starts['-'];

// Build final table: add kana, transpose and flip left-to-right
var arrPrint = Array();
for (vidx = 0; vidx < vowels.length; vidx++) {
    arrPrint[vidx] = Array();
    for (cidx = 0; cidx < consonants.length; cidx++) {
        val = roumaji_table[cidx][vidx];
        var hiragana_value = "", katakana_value = "";
        if (val.length > 0) {
            hiragana_value = String.fromCharCode(hira_table[cidx][vidx]);
            katakana_value
                = String.fromCharCode(hira_table[cidx][vidx] + diff_hira_kata);
        }
        val = '<span class="jpn">' + hiragana_value + katakana_value
              + '</span><br><span class="eng">' + val + "</span>";
        arrPrint[vidx][consonants.length - 1 - cidx] = val;
    }
}

// Display
var tr = d3.select("body")
             .append("table")
             .selectAll("tr")
             .data(arrPrint)
             .enter()
             .append("tr");

var td = tr.selectAll("td")
             .data(function(d) { return d; })
             .enter()
             .append("td")
             .html(function(d, i, j) { return d; })
             .style({ "text-align" : "center" });
