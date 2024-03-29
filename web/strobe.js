
    try {
        // var e = document.querySelector.bind(document)
        //   , t = document.querySelectorAll.bind(document)
        //   , n = document.addEventListener.bind(document);
        Element.prototype.get = Element.prototype.querySelector;
        Element.prototype.show = function() {
            this.classList.remove("hidden")
        }
        ;
        Element.prototype.hide = function() {
            this.classList.add("hidden")
        }
        ;
        Element.prototype.fadeIn = function() {
            this.show();
            this.classList.add("fade");
            this.classList.remove("left");
            this.classList.remove("right")
        }
        ;
        Element.prototype.fadeOut = function() {
            this.classList.remove("fade")
        }
        ;
        Element.prototype.left = function() {
            this.classList.add("left")
        }
        ;
        Element.prototype.right = function() {
            this.classList.add("right")
        }
    } catch (t) {}


    Date.now = Date.now || function() {
        return (new Date).getTime()
    }
    ;
    if (!("performance"in window)) {
        window.performance = {}
    }

    if (!("now"in window.performance)) {
        var o = Date.now();
        if (performance.timing && performance.timing.navigationStart) {
            o = performance.timing.navigationStart
        }
        window.performance.now = function() {
            return Date.now() - o
        }
    }
    var i = {}, r = {}, u, a, s = {}, f, c, l = window.devicePixelRatio || 1, d = false, m = "none", h = 0, w = 30, p = 120, g, x, T = "attribute vec3 p;void main(void){gl_Position=vec4(p,1.0);}", b = "precision highp float;uniform vec2 resolution;uniform float time;uniform float scale;void main(void){vec2 p=abs(gl_FragCoord.xy-resolution/2.0);float f=time*scale;float n=(p.x+p.y)/2.0+mix(f,-f,step(length(resolution)/5.5,length(p)));gl_FragColor=vec4(vec3(sin(n/5.0/scale)*8.0),1.0);}";
    function v(t, e) {
        var n = a.createShader(e);
        a.shaderSource(n, t);
        a.compileShader(n);
        if (!a.getShaderParameter(n, a.COMPILE_STATUS)) {
            return null
        }
        return n
    }
    function A() {
        if (!window.WebGLRenderingContext) {
            return false
        }
        try {
            var t = {
                alpha: false,
                premultipliedAlpha: false
            };
            a = u.getContext("webgl", t) || u.getContext("experimental-webgl", t)
        } catch (t) {
            a = null
        }
        if (!a) {
            return false
        }
        a.uniforms = {
            resolution: {},
            time: 0,
            scale: 1,
            fade: 1
        };
        a.buffer = a.createBuffer();
        a.bindBuffer(a.ARRAY_BUFFER, a.buffer);
        a.bufferData(a.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]), a.STATIC_DRAW);
        var e = a.createProgram()
          , n = v(T, a.VERTEX_SHADER)
          , o = v(b, a.FRAGMENT_SHADER);
        if (!n || !o) {
            return false
        }
        a.attachShader(e, n);
        a.attachShader(e, o);
        a.deleteShader(n);
        a.deleteShader(o);
        a.linkProgram(e);
        if (!a.getProgramParameter(e, a.LINK_STATUS)) {
            return false
        }
        a.program = e;
        return !!a
    }
    function B() {
        var t = document.body;
        try {
            if (t.requestFullscreen) {
                t.requestFullscreen()
            } else if (t.webkitRequestFullscreen) {
                t.webkitRequestFullscreen()
            } else if (t.webkitRequestFullScreen) {
                t.webkitRequestFullScreen()
            } else if (t.mozRequestFullScreen) {
                t.mozRequestFullScreen()
            }
        } catch (t) {}
    }
    function F() {
        if (document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen) {
            document.exitFullscreen()
        }
    }
    function S(e) {
        var t = new XMLHttpRequest;
        t.open("GET", "/assets/audio/" + e + ".mp3", true);
        t.responseType = "arraybuffer";
        t.onload = function() {
            f.decodeAudioData(t.response, function(t) {
                s[e] = t
            }, function() {})
        }
        ;
        t.send()
    }
    function R(t) {
        if (!s[t]) {
            return
        }
        if (f && f.resume) {
            f.resume()
        }
        var e = f.createBufferSource();
        e.buffer = s[t];
        e.connect(f.destination);
        if (e.start) {
            e.start(0)
        } else {
            e.noteOn(0)
        }
    }
    function y() {
        u.width = innerWidth * l;
        u.height = innerHeight * l;
        a.uniforms.resolution.width = u.width;
        a.uniforms.resolution.height = u.height;
        a.uniforms.scale = Math.sqrt(innerWidth * innerHeight) > 880 ? 1 : .6;
        a.viewport(0, 0, u.width, u.height)
    }
    function I() {
        r.rate = 1e3 / (performance.now() - r.now);
        r.now = performance.now();
        if (r.drop < r.dropMax && r.rate < r.rateMin) {
            r.drop++;
            if (r.drop >= r.dropMax) {
                if (window.devicePixelRatio > 1) {
                    l = 1
                } else {
                    l = .5
                }
                y()
            }
        }
    }
    function L() {
        if (!d || !a.program) {
            return
        }
        requestAnimationFrame(L);
        I();
        a.uniforms.time = (performance.now() - c) / 1e3 * p;
        if (a.uniforms.fade > 0) {
            a.uniforms.fade -= .05
        } else {
            a.uniforms.fade = 0
        }
        a.useProgram(a.program);
        a.uniform2f(a.getUniformLocation(a.program, "resolution"), a.uniforms.resolution.width, a.uniforms.resolution.height);
        a.uniform1f(a.getUniformLocation(a.program, "time"), a.uniforms.time);
        a.uniform1f(a.getUniformLocation(a.program, "scale"), a.uniforms.scale * l);
        a.bindBuffer(a.ARRAY_BUFFER, a.buffer);
        a.vertexAttribPointer(0, 2, a.FLOAT, false, 0, 0);
        a.enableVertexAttribArray(0);
        a.drawArrays(a.TRIANGLES, 0, 6);
        a.disableVertexAttribArray(0)
    }
    function E() {
        if (g > 0) {
            i.timer.innerText = g;
            g--;
            if (g < 3) {
                R("high")
            } else if (g < 9) {
                R("low")
            }
            x = setTimeout(E, 1e3)
        } else {
            R("high");
            _()
        }
    }
    function O(t, e) {
        return setTimeout(e, t)
    }
    function q() {
        i.section.webGLAlt.hide();
        i.section.intro.show();
        i.introButton.hide();
        i.introText[0].left();
        i.introText[1].right();
        O(200, function() {
            i.introTitle.fadeIn();
            i.introTitleStripes.fadeIn();
            O(1e3, function() {
                i.introText[0].fadeIn();
                O(1500, function() {
                    i.introText[1].fadeIn();
                    i.introButton.fadeIn()
                })
            })
        })
    }
    function C() {
        i.introText[0].fadeOut();
        i.introText[1].fadeOut();
        i.introTitle.fadeOut();
        i.introButton.fadeOut();
        var t = e(".ad");
        if (t) {
            t.hide()
        }
        document.title = document.title.split(" - ")[0] || document.title;
        R("low");
        O(400, k)
    }
    function k() {
        i.section.intro.hide();
        i.section.outro.hide();
        i.section.instructions.show();
        i.instructionsText[0].left();
        i.instructionsText[1].right();
        i.instructionsButton.hide();
        O(50, function() {
            i.instructionsText[0].fadeIn();
            O(200, function() {
                i.instructionsText[1].fadeIn();
                O(300, function() {
                    i.instructionsButton.fadeIn();
                    i.instructionsWarning.fadeIn()
                })
            })
        })
    }
    function D() {
        i.instructionsText[0].fadeOut();
        i.instructionsText[1].fadeOut();
        i.instructionsButton.fadeOut();
        i.instructionsWarning.fadeOut();
        u.show();
        R("low");
        O(400, P)
    }
    function P() {
        if (innerWidth / screen.width < .4) {
            B()
        }
        O(50, function() {
            d = true;
            i.section.instructions.hide();
            g = w;
            E();
            i.timer.show();
            c = performance.now();
            L();
            u.fadeIn()
        })
    }
    function _(t) {
        if (d && (g < w - 2 || t)) {
            d = false;
            F();
            u.hide();
            u.fadeOut();
            clearTimeout(x);
            i.timer.innerText = "";
            i.timer.hide();
            i.section.outro.show();
            i.outroTitle.fadeIn();
            i.outroTitle.classList.add("down");
            i.repeatButton.hide();
            i.shareButton.hide();
            if (i.appButton) {
                i.appButton.hide()
            }
            O(g > w / 2 ? 500 : 2e3, function() {
                i.outroTitle.classList.remove("down");
                i.outroText[0].left();
                if (i.outroText[1]) {
                    i.outroText[1].right()
                }
                O(500, function() {
                    i.outroText[0].fadeIn();
                    if (i.outroText[1]) {
                        i.outroText[1].fadeIn()
                    }
                    i.repeatButton.fadeIn();
                    i.shareButton.fadeIn();
                    if (i.appButton) {
                        i.appButton.fadeIn()
                    }
                })
            })
        }
    }
    function M() {
        h++;
        i.outroTitle.fadeOut();
        i.outroText[0].fadeOut();
        i.repeatButton.fadeOut();
        i.shareButton.fadeOut();
        if (i.appButton) {
            i.appButton.fadeOut()
        }
        if (i.outroText[1]) {
            i.outroText[1].fadeOut()
        }
        R("low");
        O(400, k)
    }
    function U() {
        var t = this.dataset && this.dataset.url ? this.dataset.url : ""
          , e = this.dataset && this.dataset.text ? this.dataset.text : "";
        if (navigator.share && window.Promise) {
            navigator.share({
                title: "Strobe Illusion",
                text: e,
                url: t
            }).then(function() {}).catch(function() {})
        } else {
            var n = 600
              , o = 340
              , i = screenX + (innerWidth - n) / 2
              , r = screenY + (innerHeight - o) / 2;
            window.open("https://neave.com/share/?url=" + encodeURIComponent(t) + "&text=" + e, "strobe-share", "resizable=yes,toolbar=no,scrollbars=yes,status=no,width=" + n + ",height=" + o + ",left=" + i + ",top=" + r)
        }
    }
    function W() {
        u = e(".strobe");
        u.oncontextmenu = function(t) {
            t.preventDefault()
        }
        ;
        i = {
            section: {
                webGLAlt: e(".alt.webgl"),
                intro: e(".intro"),
                instructions: e(".instructions"),
                outro: e(".outro")
            },
            introTitle: e(".intro h1"),
            introTitleStripes: e(".intro h1 .stripes"),
            introText: t(".intro > p"),
            introButton: e(".intro .button"),
            instructionsButton: e(".instructions .button"),
            instructionsText: t(".instructions > p"),
            instructionsWarning: e(".instructions .warning"),
            outroTitle: e(".outro h2"),
            outroText: t(".outro > p"),
            repeatButton: e(".outro .button.repeat"),
            shareButton: e(".outro .button.share"),
            appButton: e(".outro .button.app"),
            timer: e(".timer")
        };
        if (A()) {
            r = {
                rate: 0,
                now: 0,
                drop: 0,
                dropMax: 10,
                rateMin: 40
            };
            y();
            window.onresize = y;
            i.introButton.onclick = C;
            i.instructionsButton.onclick = D;
            window.onblur = u.onmouseleave = _;
            u.onmousedown = function() {
                _()
            }
            ;
            i.repeatButton.onclick = M;
            i.shareButton.onclick = U;
            n("visibilitychange", function() {
                if (document.hidden) {
                    _()
                }
            });
            if (window.AudioContext) {
                f = new AudioContext;
                S("low");
                S("high")
            }
            q()
        } else {
            try {
                i.section.webGLAlt.show();
                O(250, function() {
                    e(".alt.webgl h1").fadeIn()
                })
            } catch (t) {}
        }
    }
    n("DOMContentLoaded", W, false)

