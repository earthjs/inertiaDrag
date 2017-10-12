function inertiaDrag(projection, render, started, moved, ended) {
    let rotateX = 0,
        rotateY = 0,
        rotateZ = [],
        rotateVX = 0,
        rotateVY = 0,
        previousX = 0,
        previousY = 0,
        animatedTimer = null;

    let dragging = false,
        rendering = false,
        draggMove = undefined;

    function stopAnimatedTimer() {
        if (animatedTimer) {
            animatedTimer.stop();
            animatedTimer = null;
        }
    }

    function animated() {
        if (!rendering) {
            stopAnimatedTimer();
            render();
            return;
        }

        rotateVX *= 0.99;
        rotateVY *= 0.90;

        if (dragging) {
            rotateVX *= 0.25;
            rotateVY *= 0.20;
        }

        if (rotateY < -100) {
            rotateY = -100;
            rotateVY *= -0.95;
        }

        if (rotateY > 100) {
            rotateY = 100;
            rotateVY *= -0.95;
        }

        rotateX += rotateVX;
        rotateY += rotateVY;

        render([rotateX, rotateY, rotateZ[2]]);

        if (!dragging &&
            previousX.toPrecision(5) === rotateX.toPrecision(5) &&
            previousY.toPrecision(5) === rotateY.toPrecision(5)) {
            rendering = false;
        }
        previousX = rotateX;
        previousY = rotateY;
    }

    function mouseMovement() {
        const {sourceEvent} = d3.event;
        if (sourceEvent) { // sometime sourceEvent=null
            const t = sourceEvent.touches ? sourceEvent.touches[0] : sourceEvent;
            return [t.clientX, -t.clientY];
        }
    }

    let cmouse, pmouse;
    function onDragging() {
        if(dragging){
            draggMove = true;
            pmouse = cmouse;
            cmouse = mouseMovement.call(this);
            if (cmouse) { // sometime sourceEvent=null
                rotateZ = projection.rotate();
                rotateX = rotateZ[0];
                rotateY = rotateZ[1];
                rotateVX += cmouse[0] - pmouse[0];
                rotateVY += cmouse[1] - pmouse[1];
                animated();
            } else {
                cmouse = pmouse;
            }
        }
    }
    const s0 = projection.scale();
    const zoomScale = [0,50000];
    const inertia = {
        start() {
            rotateVX = 0;
            rotateVY = 0;
            dragging = true;
            rendering = true;
            draggMove = null;
            stopAnimatedTimer();
            cmouse = mouseMovement.call(this);
            started && started.call(this, d3.mouse(this));
        },
        move() {
            const {type, touches} = d3.event.sourceEvent;
            if (type==='wheel' || (touches && touches.length===2)) {
                const r1 = s0 * d3.event.transform.k;
                if (r1>=zoomScale[0] && r1<=zoomScale[1]) {
                    projection.scale(r1);
                    render();
                }
                rotateVX = 0;
                rotateVY = 0;
            } else {
                onDragging.call(this);
            }
            moved && moved.call(this, d3.mouse(this));
        },
        end() {
            dragging = false;
            if (draggMove) {
                draggMove = false;
                animatedTimer = d3.timer(animated);
            }
            ended && ended.call(this, d3.mouse(this));
        },
    }
    return inertia;
};
