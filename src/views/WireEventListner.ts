import { CurveSceneView } from "./CurveSceneView"

export function wireEventListner(canvas: HTMLCanvasElement, curveSceneView: CurveSceneView) {
    
    hideContextMenu()
    
    function mouse_get_NormalizedDeviceCoordinates(event: MouseEvent) {
        var x, y,
            rect  = canvas.getBoundingClientRect(),
            ev

        ev = event
        
        x = ((ev.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2)
        y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2)
        return [x, y]
    }

    function touch_get_NormalizedDeviceCoordinates(event: TouchEvent) {
        var x, y,
            rect  = canvas.getBoundingClientRect(),
            ev;
 
        ev = event.touches[0]
        
        x = ((ev.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2)
        y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2)
        return [x, y]
    }


    function mouse_click(ev: MouseEvent) {
        hideContextMenu()
        let c = mouse_get_NormalizedDeviceCoordinates(ev)
        const mousePrecision =  0.0005
        curveSceneView.leftMouseDown_event(c[0], c[1], mousePrecision)
        curveSceneView.renderFrame()
        ev.preventDefault()
    }

    function mouse_drag(ev: MouseEvent) {
        var c = mouse_get_NormalizedDeviceCoordinates(ev)
        curveSceneView.leftMouseDragged_event(c[0], c[1])
        curveSceneView.renderFrame()
        ev.preventDefault()

    }

    function mouse_stop_drag(ev: MouseEvent) {
        curveSceneView.leftMouseUp_event()
        ev.preventDefault()
    }

    function touch_click(ev: TouchEvent) {
        let c = touch_get_NormalizedDeviceCoordinates(ev)
        curveSceneView.leftMouseDown_event(c[0], c[1])
        curveSceneView.renderFrame()
        ev.preventDefault()
    }

    function touch_drag(ev: TouchEvent) {
        var c = touch_get_NormalizedDeviceCoordinates(ev)
        curveSceneView.leftMouseDragged_event(c[0], c[1])
        curveSceneView.renderFrame()
        ev.preventDefault()
    }

    function touch_stop_drag(ev: TouchEvent) {
        curveSceneView.leftMouseUp_event()
        ev.preventDefault()
    }

    canvas.addEventListener('mousedown', mouse_click, false)
    canvas.addEventListener('mousemove', mouse_drag, false)
    canvas.addEventListener('mouseup', mouse_stop_drag, false)
    canvas.addEventListener('touchstart', touch_click, false)
    canvas.addEventListener('touchmove', touch_drag, false)
    canvas.addEventListener('touchend', touch_stop_drag, false)

    // Prevent scrolling when touching the canvas
    document.body.addEventListener("touchstart", function (e) {
        if (e.target === canvas) {
            e.preventDefault()
        }
    }, false)
    document.body.addEventListener("touchend", function (e) {
        if (e.target === canvas) {
            e.preventDefault()
        }
    }, false)
    document.body.addEventListener("touchmove", function (e) {
        if (e.target === canvas) {
            e.preventDefault()
        }
    }, false)

    function hideContextMenu() {
        const cm = document.getElementById("contextMenu")
        if (cm) {
            cm.style.display = "none"
        }
    }

    function rightClick(e: MouseEvent) {
        e.preventDefault()

        const cm = document.getElementById("contextMenu")
        if (cm) {
                //cm.style.display = "block"
                cm.style.left = e.pageX + "px"
                cm.style.top = e.pageY + "px"
                cm.style.display = "block"
        }
    }

    function addControlPoint() {
        hideContextMenu()
        curveSceneView.addControlPoint()
    }

    document.getElementById("addControlPoint")?.addEventListener('click', addControlPoint)

    canvas.addEventListener('contextmenu', rightClick, false)


    let toggleButtonCurvatureExtrema = <HTMLButtonElement> document.getElementById("toggleButtonCurvatureExtrema")
    let toggleButtonInflection = <HTMLButtonElement> document.getElementById("toggleButtonInflections")
    

    function toggleControlOfCurvatureExtrema() {
        curveSceneView.toggleControlOfCurvatureExtrema()
    }

    function toggleControlOfInflections() {
        curveSceneView.toggleControlOfInflections()
    }


    function selectCurveCategory(event: any) {
        curveSceneView.selectCurveCategory(event.detail.category)
    }

    toggleButtonCurvatureExtrema.addEventListener('click', toggleControlOfCurvatureExtrema)
    toggleButtonInflection.addEventListener('click', toggleControlOfInflections)

    let app = document.getElementsByTagName("app-curves-and-surfaces")[0]
    app.addEventListener("changeCurveCategory", selectCurveCategory)


}