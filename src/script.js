import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'


/**
 * Base
 */
// Debug
const gui = new GUI({width: 360})
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const parameters = {}
parameters.size = 0.01
parameters.count = 100000
parameters.radius = 5
parameters.branches = 4
parameters.spin = 1
parameters.randomness = 0.2
parameters.randomnessSpread = 0.5
parameters.randomnessPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

let geometry = null
let material = null
let points = null

const generateGalaxy = () => {
    if(points !== null){
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }
    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const insideColor = parameters.insideColor
    const outsideColor = parameters.outsideColor

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;
        // position
        const radius = Math.random() * parameters.radius;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2 + (Math.random() * 0.1 - 0.05);
        const spinAngle = radius * parameters.spin + (Math.random() * 0.1 - 0.05);
        // randomness
        const randomnessStrength = 1 - radius / parameters.radius * parameters.randomnessSpread;
    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * randomnessStrength * (Math.random() < 0.5 ? 1 : -1);
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * randomnessStrength * (Math.random() < 0.5 ? 1 : -1);
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * randomnessStrength * (Math.random() < 0.5 ? 1 : -1);
        // x , y, z positions over the 360 angle
        positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ
        
        //colors
        const mixedColor = new THREE.Color(insideColor)
        mixedColor.lerp(new THREE.Color(outsideColor), radius / parameters.radius)
        colors[i3    ] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position' , new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color' , new THREE.BufferAttribute(colors, 3))
    material = new THREE.PointsMaterial()
    material.size = parameters.size
    material.sizeAttenuation = true
    material.depthWrite = false
    material.blending = THREE.AdditiveBlending
    material.vertexColors = true
    points = new THREE.Points(geometry, material)
    scene.add(points)
}
generateGalaxy()
gui.add(parameters , 'count').min(100).max(500000).step(1000).onFinishChange(generateGalaxy)
gui.add(parameters , 'size').min(0.01).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters , 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters , 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters , 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters , 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters , 'randomnessSpread').min(0).max(1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters , 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters , 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters , 'outsideColor').onFinishChange(generateGalaxy)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    
    

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()