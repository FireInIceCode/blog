var G = (function () {
    var Config = {
        node_r: 40,
        state_names: ['default', 'gs1', 'gs2', 'gs3'],
        e_len: 200,
        e_f: 0.01,
        e_maxf: 1,
        n_len: 120,
        n_f: 1000,
        n_maxf: 1,
        center_f: 0.0005,
        c_w: 800,
        c_h: 600,
        eps: 0.1,
        line_style: 'black',
        line_width: 3,
        line_font: '14px 微软雅黑',
        e_force: (d) => { return Math.max(d - Config.e_len, 0) * Config.e_f },
        e_force: (d) => { return Math.min((d - Config.e_len) * Config.e_f, Config.e_maxf) },
        n_force: (d) => { return Math.min(d > Config.eps ? 1 / d / d * Config.n_f : 1 / Config.eps * Config.n_f, Config.n_maxf) },
        c_force: (d) => { return Config.center_f * d },
        t_sw: 100,
        t_sh: 100
    };
    var Global = {
        mousefocus: null,
        mouseoffsetx: 0,
        mouseoffsety: 0,
        canvas: null,
        line_canvas: null
    };
    function Node() {
        this.x = Math.random() * Config.c_w;
        this.y = Math.random() * Config.c_h;
        this.state = 0;
        this.vx = 0;
        this.vy = 0;
        this.text = '';
        this.el = document.createElement('div');
        this.fixed = false;
        this.el.classList.add('gnode');
        this.dat = {};
        this.es = [];
        Global.canvas.appendChild(this.el);

        this.el.addEventListener('mousedown', (function (e) {
            if (Global.mousefocus || e.button != 0) return;
            Global.mousefocus = this;
            Global.mouseoffsetx = -e.x + this.x;
            Global.mouseoffsety = -e.y + this.y;
        }).bind(this));
        this.el.addEventListener('mouseup', (function (e) {
            if (e.button != 1) return;
            this.fixed ^= 1;
            this.el.classList.toggle('gfixed');
        }).bind(this));

        this.el.addEventListener('mouseup', (function (e) {
            if (e.button != 2) return;
            this.toggle_state();
        }).bind(this));
        this.el.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
    }
    Node.prototype.toggle_state = function () {
        this.el.classList.remove(Config.state_names[this.state]);
        this.state = (this.state + 1) % Config.state_names.length;
        this.el.classList.add(Config.state_names[this.state]);
    }
    Node.prototype.render = function () {
        this.el.style.left = this.x + 'px';
        this.el.style.top = this.y + 'px';
        this.el.innerHTML = this.text;
        this.el.style.lineHeight = this.el.style.width = this.el.style.height = Config.node_r + 'px';
    }
    Node.prototype.del = function () {
        this.el.parentElement.removeChild(this.el);
    }
    function Edge(u, v, w) {
        this.u = u;
        this.v = v;
        this.w = w;
        this.u.es.push(v);
        this.v.es.push(u);
    }
    function Graph() {
        this.nodes = [];
        this.edges = [];
        this.timer = 0;
        this.line_canvas = document.createElement('canvas');
        this.ctx = this.line_canvas.getContext('2d');
        Global.line_canvas = this.line_canvas;
        Global.canvas.appendChild(this.line_canvas);
    }
    function distance(a, b) {
        return Math.sqrt(Math.max((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y), 1));
    }
    Graph.prototype.step = function (t) {
        var e_force = Config.e_force, n_force = Config.n_force;
        for (var u of this.nodes) u.vx = u.vy = 0;
        for (var e of this.edges) {
            var d = distance(e.u, e.v);
            e.u.vx += -e_force(d) * (e.u.x - e.v.x) / d;
            e.u.vy += -e_force(d) * (e.u.y - e.v.y) / d;
            e.v.vx += e_force(d) * (e.u.x - e.v.x) / d;
            e.v.vy += e_force(d) * (e.u.y - e.v.y) / d;
        }
        for (var i = 0; i < this.nodes.length; i++) {
            for (var j = 0; j < i; j++) {
                var u = this.nodes[i], v = this.nodes[j];
                var d = distance(u, v);
                u.vx += n_force(d) * (u.x - v.x) / d;
                u.vy += n_force(d) * (u.y - v.y) / d;
                v.vx += -n_force(d) * (u.x - v.x) / d;
                v.vy += -n_force(d) * (u.y - v.y) / d;
            }
        }
        c = { x: Config.c_w / 2, y: Config.c_h / 2 };
        for (var u of this.nodes) {
            if (u.fixed || u == Global.mousefocus) continue;
            var d = distance(u, c);
            u.vx += Config.c_force(d) * (c.x - u.x) / d;
            u.vy += Config.c_force(d) * (c.y - u.y) / d;
            if (Math.abs(u.vx * t) > 0.1e-3) u.x += u.vx * t;
            if (Math.abs(u.vy * t) > 0.1e-3) u.y += u.vy * t;

            u.x=Math.max(u.x,0);
            u.x=Math.min(u.x,Config.c_w);
            u.y=Math.max(u.y,0);
            u.y=Math.min(u.y,Config.c_h);
        }

        for (var u of this.nodes) {
            u.render();
        }
        this.ctx.lineWidth = Config.line_width;
        this.ctx.strokeStyle = Config.line_style;
        this.ctx.font = Config.line_font;
        this.ctx.clearRect(0, 0, Config.c_w, Config.c_h);
        for (var e of this.edges) {
            this.ctx.beginPath();
            this.ctx.moveTo(e.u.x + Config.node_r / 2, e.u.y + Config.node_r / 2);
            this.ctx.lineTo(e.v.x + Config.node_r / 2, e.v.y + Config.node_r / 2);
            this.ctx.stroke();

            this.ctx.fillText(e.w, (e.u.x + e.v.x + Config.node_r) / 2, (e.u.y + e.v.y + Config.node_r) / 2);
        }
    }
    Graph.prototype.start = function () {
        this.timer = setInterval(() => { this.step(1000 / 60) }, 1000 / 60);
    }
    Graph.prototype.clear = function () {
        for (var u of this.nodes) {
            u.del();
        }
        this.nodes = [];
        this.edges = [];
    }

    function calcwidth(u, f) {
        u.dat.width = 0;
        for (var v of u.es) {
            if (v == f) continue;
            calcwidth(v, u);
            u.dat.width += v.dat.width;
            u.dat.width += Config.t_sw;
        }
        if (u.dat.width) u.dat.width -= Config.t_sw;
    }
    function treehelper(u, f) {
        var x = u.x - u.dat.width / 2 + Config.node_r;
        for (var v of u.es) {
            if (v == f) continue;
            v.x = x;
            v.y = u.y + Config.t_sh;
            x += v.dat.width + Config.t_sw;
            treehelper(v, u);
        }
    }
    Graph.prototype.arrange_as_tree = function (root) {
        var rt = this.nodes[0];
        for (var u of this.nodes) {
            u.fixed = true;
            u.el.classList.add('gfixed');
            if (u.text == root)
                rt = u;
        }
        rt.x = Config.c_w / 2 - Config.node_r;
        rt.y = Config.t_sh;
        calcwidth(rt, null);
        treehelper(rt, null);
    }
    function setsize(w, h) {
        if (w) Config.c_w = w;
        if (h) Config.c_h = h;
        Global.canvas.style.width = Config.c_w + 'px';
        Global.canvas.style.height = Config.c_h + 'px';
        Global.line_canvas.width = Config.c_w;
        Global.line_canvas.height = Config.c_h;
    }
    function init(canvas) {
        Global.canvas = document.querySelector(canvas);
        Global.canvas.classList.add('gcanvas');
        Global.graph = new Graph();
        setsize();
        Global.graph.start();
        Global.canvas.addEventListener('mousemove', (function (e) {
            if (!Global.mousefocus) return;
            Global.mousefocus.x = e.x + Global.mouseoffsetx;
            Global.mousefocus.y = e.y + Global.mouseoffsety;
            Global.mousefocus.render();
        }));
        Global.canvas.addEventListener('mouseup', (function (e) {
            Global.mousefocus = null;
        }));
        return Global.graph;
    }
    return {
        Graph: Graph,
        Node: Node,
        Edge: Edge,
        init: init,
        setsize: setsize
    };
})();