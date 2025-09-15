import * as THREE from 'three'

export class ThreeSceneBase {
  constructor(canvas) {
    this.canvasEl = canvas
    this.containerEl = undefined
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
    this.requestAnimationFrameId = -1
    this.resizeObserver = undefined

    this.setupContainer()
  }

  setupContainer() {
    const parentEl = this.canvasEl.parentElement
    if (parentEl) {
      const tempDivEl = document.createElement('div')
      Object.assign(tempDivEl.style, {
        position: 'relative',
        width: '100%',
        height: '100%',
      })
      Object.assign(this.canvasEl.style, {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: '0',
        top: '0',
      })
      tempDivEl.append(this.canvasEl)
      parentEl.append(tempDivEl)
      this.containerEl = tempDivEl
      
      const callback = (entries) => {
        if (entries.length === 0) return
        const _parentEl = entries[0].target
        if (_parentEl) {
          this.renderer.setSize(_parentEl.clientWidth, _parentEl.clientHeight)
          this.camera.aspect = _parentEl.clientWidth / _parentEl.clientHeight
          this.camera.updateProjectionMatrix()
        }
      }
      
      this.resizeObserver = new ResizeObserver(this.debounce(callback.bind(this), 100))
      this.resizeObserver.observe(tempDivEl, {})
    }
  }

  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  setLoadingMaskVisible(visible) {
    if (this.containerEl) {
      if (visible) this.containerEl.setAttribute('loading', '')
      else this.containerEl.removeAttribute('loading')
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  destroy() {
    this.resizeObserver && this.resizeObserver.disconnect()
    cancelAnimationFrame(this.requestAnimationFrameId)
    
    this.scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose()
      if (object.texture) object.texture.dispose()
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose())
        } else {
          object.material.dispose()
        }
      }
    })
    
    this.scene.clear()
    this.renderer.dispose()
    this.renderer.forceContextLoss()
    
    let gl = this.renderer.domElement.getContext('webgl')
    if (gl) {
      const e = gl.getExtension('WEBGL_lose_context')
      e && e.loseContext()
      gl = null
    }
  }
}
