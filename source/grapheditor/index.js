function parseCommand(str, graph) {
    str = str.split('@')[1];
    words = str.split(' ');
    if (words[0] == 'set-size') {
        if (words.length == 3) {
            G.setsize(parseInt(words[1]), parseInt(words[2]));
        } else {
            alert('Incorrect format')
        }
    } else if(words[0]=='show-as-tree'){
        if(words.length==2){
            graph.arrange_as_tree(words[1]);
        }else if(words.length==1){
            graph.arrange_as_tree();
        }else{
            alert("Incorrect format");
        }
    } else {
        alert('Incorrect command');
    }
}
function parse(str, graph, canvas) {
    nodemap = {};
    var newstr = [];
    for (var line of str.split('\n')) {
        if (!line) {
            newstr.push('')
            continue;
        }
        if (line[0] == '@') {
            parseCommand(line, graph);
            continue;
        }
        newstr.push(line)
        var words = line.split(' ');
        if (words.length != 1 && words.length != 2 && words.length != 3)
            continue;
        if (words.length == 1) {
            if (!nodemap[words[0]]) {
                nodemap[words[0]] = new G.Node();
                nodemap[words[0]].text = words[0];
                graph.nodes.push(nodemap[words[0]]);
            }
            continue;
        }
        words.push('');
        if (!nodemap[words[0]]) {
            nodemap[words[0]] = new G.Node();
            nodemap[words[0]].text = words[0];
            graph.nodes.push(nodemap[words[0]]);
        }
        if (!nodemap[words[1]]) {
            nodemap[words[1]] = new G.Node();
            nodemap[words[1]].text = words[1];
            graph.nodes.push(nodemap[words[1]]);
        }
        graph.edges.push(new G.Edge(nodemap[words[0]], nodemap[words[1]], words[2]));
    }
    return newstr.join('\n');
}

window.onload = () => {
    graph = G.init('.canvas');
    // for (var i = 0; i < 100; i++) { var node = new G.Node(); node.text = i; graph.nodes.push(node); }
    // for (var i = 0; i < 100; i++) {
    //     var u=graph.nodes[parseInt(Math.random()*graph.nodes.length)];
    //     var v=graph.nodes[parseInt(Math.random()*graph.nodes.length)];
    //     graph.edges.push(new G.Edge(u,v,''));
    // }
    editor = document.querySelector('#graphtext');
    editor.addEventListener('keyup', (e) => {
        if (e.keyCode != 13) return;
        graph.clear();
        editor.value = parse(editor.value, graph, document.querySelector('.canvas'));
    });
}