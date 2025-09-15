import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import { ThreeSceneBase } from './ThreeSceneBase.js'

export class LifeMapRenderer extends ThreeSceneBase {
  constructor(canvas) {
    super(canvas)
    
    this.mapContainer = new THREE.Group()
    this.mapItems = new Map()
    this.playerEntity = null
    this.currentPath = []
    this.pathIndex = 0
    
    this.init()
  }

  init() {
    this.initScene()
    this.initLights()
    this.initControls()
    this.initMap()
    this.animate()
  }

  initScene() {
    // 设置背景
    this.scene.background = new THREE.Color(0x87CEEB) // 天空蓝
    this.scene.add(this.mapContainer)
  }

  initLights() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    this.scene.add(ambientLight)

    // 方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 50
    this.scene.add(directionalLight)

    // 半球光
    const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x228B22, 0.4)
    this.scene.add(hemisphereLight)
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.canvasEl)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.screenSpacePanning = false
    this.controls.minDistance = 5
    this.controls.maxDistance = 50
    this.controls.maxPolarAngle = Math.PI / 2
  }

  initMap() {
    // 创建人生地图路径
    this.createLifePath()
    this.createLifeStages()
    this.createPlayer()
    
    // 设置相机位置
    this.camera.position.set(0, 15, 20)
    this.camera.lookAt(0, 0, 0)
  }

  createLifePath() {
    // 创建人生路径 - 螺旋形状代表人生历程
    const pathPoints = []
    const stages = 20 // 人生20个阶段
    const radius = 8
    
    for (let i = 0; i <= stages; i++) {
      const angle = (i / stages) * Math.PI * 4 // 两圈螺旋
      const currentRadius = radius * (1 - i / stages * 0.3) // 逐渐缩小
      const height = i * 0.5 // 逐渐上升
      
      const x = Math.cos(angle) * currentRadius
      const z = Math.sin(angle) * currentRadius
      const y = height
      
      pathPoints.push(new THREE.Vector3(x, y, z))
    }
    
    this.currentPath = pathPoints
    
    // 绘制路径
    const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints)
    const pathMaterial = new THREE.LineBasicMaterial({ 
      color: 0xFFD700, 
      linewidth: 3 
    })
    const pathLine = new THREE.Line(pathGeometry, pathMaterial)
    this.mapContainer.add(pathLine)
  }

  createLifeStages() {
    // 人生各个阶段的标志点
    const stages = [
      { name: '出生', color: 0xFF69B4, icon: '👶' },
      { name: '童年', color: 0x87CEEB, icon: '🧒' },
      { name: '求学', color: 0x32CD32, icon: '🎓' },
      { name: '工作', color: 0xFF4500, icon: '💼' },
      { name: '恋爱', color: 0xFF1493, icon: '💕' },
      { name: '结婚', color: 0xFFD700, icon: '💒' },
      { name: '育儿', color: 0x98FB98, icon: '👨‍👩‍👧‍👦' },
      { name: '事业', color: 0x4169E1, icon: '🏆' },
      { name: '中年', color: 0xDDA0DD, icon: '🧑‍🦳' },
      { name: '退休', color: 0xF0E68C, icon: '🏖️' },
      { name: '晚年', color: 0xDC143C, icon: '👴' }
    ]

    stages.forEach((stage, index) => {
      if (index < this.currentPath.length) {
        const position = this.currentPath[Math.floor(index * this.currentPath.length / stages.length)]
        this.createStageMarker(position, stage)
      }
    })
  }

  createStageMarker(position, stage) {
    // 创建阶段标记
    const group = new THREE.Group()
    
    // 基础平台
    const platformGeometry = new THREE.CylinderGeometry(1, 1, 0.2, 8)
    const platformMaterial = new THREE.MeshLambertMaterial({ color: stage.color })
    const platform = new THREE.Mesh(platformGeometry, platformMaterial)
    platform.castShadow = true
    platform.receiveShadow = true
    group.add(platform)
    
    // 文字标签
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = 256
    canvas.height = 128
    
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#000000'
    context.font = '32px Arial'
    context.textAlign = 'center'
    context.fillText(stage.icon, canvas.width / 2, 40)
    context.fillText(stage.name, canvas.width / 2, 80)
    
    const texture = new THREE.CanvasTexture(canvas)
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
    const sprite = new THREE.Sprite(spriteMaterial)
    sprite.position.y = 1.5
    sprite.scale.set(2, 1, 1)
    group.add(sprite)
    
    group.position.copy(position)
    group.userData = { stage: stage.name, type: 'lifeStage' }
    
    this.mapContainer.add(group)
    this.mapItems.set(stage.name, group)
  }

  createPlayer() {
    // 创建玩家角色
    const playerGroup = new THREE.Group()
    
    // 身体
    const bodyGeometry = new THREE.CapsuleGeometry(0.3, 1, 4, 8)
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4169E1 })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.castShadow = true
    playerGroup.add(body)
    
    // 头部
    const headGeometry = new THREE.SphereGeometry(0.25, 8, 6)
    const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFDBAC })
    const head = new THREE.Mesh(headGeometry, headMaterial)
    head.position.y = 0.8
    head.castShadow = true
    playerGroup.add(head)
    
    // 设置初始位置
    if (this.currentPath.length > 0) {
      playerGroup.position.copy(this.currentPath[0])
      playerGroup.position.y += 1
    }
    
    this.playerEntity = playerGroup
    this.mapContainer.add(playerGroup)
  }

  // 移动玩家到指定阶段
  movePlayerToStage(stageIndex) {
    if (!this.playerEntity || stageIndex >= this.currentPath.length) return
    
    const targetPosition = this.currentPath[stageIndex].clone()
    targetPosition.y += 1
    
    // 使用GSAP进行平滑动画
    gsap.to(this.playerEntity.position, {
      duration: 2,
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      ease: "power2.inOut",
      onComplete: () => {
        this.pathIndex = stageIndex
        // 可以在这里触发到达事件
        this.onPlayerReachStage(stageIndex)
      }
    })
    
    // 相机跟随
    const cameraTarget = targetPosition.clone()
    cameraTarget.y += 5
    cameraTarget.z += 10
    
    gsap.to(this.camera.position, {
      duration: 2,
      x: cameraTarget.x,
      y: cameraTarget.y,
      z: cameraTarget.z,
      ease: "power2.inOut"
    })
  }

  onPlayerReachStage(stageIndex) {
    console.log(`玩家到达阶段: ${stageIndex}`)
    // 这里可以触发相应的事件，比如显示任务、对话等
    // 可以通过事件系统通知Vue组件
    if (this.onStageReached) {
      this.onStageReached(stageIndex)
    }
  }

  // 鼠标点击检测
  onMouseClick(event) {
    const mouse = new THREE.Vector2()
    const rect = this.canvasEl.getBoundingClientRect()
    
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, this.camera)
    
    const intersects = raycaster.intersectObjects(this.mapContainer.children, true)
    
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object
      let targetGroup = clickedObject
      
      // 找到包含userData的父级Group
      while (targetGroup && !targetGroup.userData.type) {
        targetGroup = targetGroup.parent
      }
      
      if (targetGroup && targetGroup.userData.type === 'lifeStage') {
        // 点击了人生阶段，移动玩家
        const stageIndex = Array.from(this.mapItems.values()).indexOf(targetGroup)
        if (stageIndex !== -1) {
          this.movePlayerToStage(stageIndex)
        }
      }
    }
  }

  animate() {
    this.requestAnimationFrameId = requestAnimationFrame(() => this.animate())
    
    this.controls.update()
    this.render()
  }

  // 设置阶段到达回调
  setStageReachedCallback(callback) {
    this.onStageReached = callback
  }
}
