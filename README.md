# inertiaDrag
inertia drag &amp; standard zoom for globe.

Extracted from [earthjs - inertiaPlugin.js](https://github.com/earthjs/earthjs/blob/master/src/base/inertiaPlugin.js) inspired by google small arms js code.

This is *non versor.js*, if you need versor.js based inertia drag, you can check excellent work by [@Fil](https://bl.ocks.org/Fil/f48de8e9207799017093a169031adb02/d2ecafe469595af009991176b91dac507edd8523).

## Example
Refelevant html & js code showed below, to illustrate how to use the inertiaDrag.js
```html
<script src="inertiaDrag.js"></script>
<script src="topojson.js"></script>
<script src="d3.js"></script>
...
<canvas width="960" height="500"></canvas>
<script>
    let land;
    const canvas = d3.select("canvas"),
    projection = d3.geoOrthographic(),
    context = canvas.node().getContext("2d"),
    path = d3.geoPath().projection(projection).context(context),
    render = function(r) {
        r && projection.rotate(r);
        context.clearRect(0, 0, 960, 500);
        context.beginPath();
        path(land);
        context.fill();
    };
    // complete params: (projection, render, started, moved, ended)
    const {start, move, end} = inertiaDrag(projection, render);
    canvas.call(d3.zoom()
    .on("start", start)
    .on('zoom', move)
    .on("end", end)
    );
    d3.json("d/world-110m.json", function(error, world) {
        land = topojson.feature(world, world.objects.land);
        render();
    });
</script>
```
It create a high order object, having 3 higher order functions that can be use for **d3.zoom** or d3.drag, I my self prefer as a handle for d3.zoom as it will handle dragging and zooming out of the book.  

## License
inertiaDrag.js is licensed under the **MIT license**. See the LICENSE file for more information.

```
MIT License

Copyright (c) 2017 earthjs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
