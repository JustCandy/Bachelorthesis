import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { InteractionManager } from 'three.interactive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Properties
  selectedGridLength: number = 3;
  selectedPanelColor: string = '#00ff00';
  selectedPanelTransparency: boolean = false;
  panels: THREE.Mesh[] = []; // Array for saving the panels
  isAddMode: boolean = true;
  showOutlines: boolean = true;
  magicNumber: number = 25;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();

  ngOnInit() { 
    performance.mark("start");
    //console.log(`Total time for fetch and render: ${measure.duration}ms`);
        
    this.renderer.setClearColor(0xefefef); // White background color

    // Set camera position
    this.camera.position.z = 100;
    this.camera.position.y = 100;

    // Create controls for orbiting the camera
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.update();

    // Resize at first start
    this.resize();

    // Window Resize Event
    window.addEventListener('resize', this.resize);

    // Append the renderer's canvas to the container element
    const container = document.getElementById('container');
    if (container !== null) {
      container.appendChild(this.renderer.domElement);
    }

    // Setup interaction manager
    const interactionManager = new InteractionManager(this.renderer, this.camera, this.renderer.domElement);

    // Create grid
    const gridSize = this.magicNumber * 10;
    const gridStep = this.magicNumber;
    const gridColor = 0xCCCCCC;
    const gridHelper = new THREE.GridHelper(gridSize, gridSize / gridStep, gridColor, gridColor);
    gridHelper.position.x = this.magicNumber / 2;
    gridHelper.position.y = -this.magicNumber / 2;
    gridHelper.position.z = this.magicNumber;
    this.scene.add(gridHelper);
    
    performance.mark("end");
        // creating performance measurement
    const measure = performance.measure(
      "measurement",
      "start",
      "end"
    );  
    console.log(`Total time for fetch and render: ${measure.duration}ms`);
    
    // Add the initial panel
    this.addPanel(interactionManager,-50, 0, -50, "x");

    this.animate();
  }

  // Function to handle window resize
  resize() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.renderer.setSize(width / 1.2, height / 1.1);
    this.camera.aspect = (width / 1.2) / (height / 1.1);
    this.camera.updateProjectionMatrix();
  }

  // Animation loop
  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }

  // Function to add a new panel to the scene
  addPanel(interactionManager: InteractionManager, positionX: number, positionY: number, positionZ: number, direction: string) {
    if (!this.isPanelAtPosition(positionX, positionY, positionZ)) {
      let geometry;
      const material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });

      if (direction == "x") {
        geometry = new THREE.BoxGeometry(this.magicNumber, this.magicNumber, 0.1);
      } else if (direction == "z") {
        geometry = new THREE.BoxGeometry(0.1, this.magicNumber, this.magicNumber);
      }

      const panel = new THREE.Mesh(geometry, material);
      panel.position.set(positionX, positionY, positionZ);

      // Create outline
      const outlineGeometry = new THREE.EdgesGeometry(geometry);
      const outlineMaterial = new THREE.LineBasicMaterial({ color: 0x555555 });
      const outline = new THREE.LineSegments(outlineGeometry, outlineMaterial);
      outline.name = 'outline'; // Give the outline a name for later reference
      panel.add(outline);

      // Add event listener for panel click
      panel.addEventListener('mousedown', (event) => {
        if (this.isAddMode && panel.material.transparent && panel.material.opacity === 0) {
          const outline = panel.getObjectByName('outline');
          if (outline !== undefined) {
            outline.visible = false;
          }
          panel.material.opacity = 0.9;
          if (direction == "x") {
            this.addPanel(interactionManager, positionX + this.magicNumber, positionY, positionZ, "x");
            this.addPanel(interactionManager, positionX - this.magicNumber, positionY, positionZ, "x");
            this.addPanel(interactionManager, positionX + (this.magicNumber / 2), positionY, positionZ + (this.magicNumber / 2), "z");
            this.addPanel(interactionManager, positionX + (this.magicNumber / 2), positionY, positionZ - (this.magicNumber / 2), "z");
            this.addPanel(interactionManager, positionX - (this.magicNumber / 2), positionY, positionZ + (this.magicNumber / 2), "z");
            this.addPanel(interactionManager, positionX - (this.magicNumber / 2), positionY, positionZ - (this.magicNumber / 2), "z");
          } else if (direction == "z") {
            this.addPanel(interactionManager, positionX, positionY, positionZ + this.magicNumber, "z");
            this.addPanel(interactionManager, positionX, positionY, positionZ - this.magicNumber, "z");
            this.addPanel(interactionManager, positionX + (this.magicNumber / 2), positionY, positionZ + (this.magicNumber / 2), "x");
            this.addPanel(interactionManager, positionX + (this.magicNumber / 2), positionY, positionZ - (this.magicNumber / 2), "x");
            this.addPanel(interactionManager, positionX - (this.magicNumber / 2), positionY, positionZ + (this.magicNumber / 2), "x");
            this.addPanel(interactionManager, positionX - (this.magicNumber / 2), positionY, positionZ - (this.magicNumber / 2), "x");
          }
        } else if (!this.isAddMode) {
          panel.material.opacity = 0;
          if (this.showOutlines) {
            const outline = panel.getObjectByName('outline');
            if (outline !== undefined) {
              outline.visible = true;
            }
          }
        }
        event.target.material.color.set(0xCCCCCC);
      });

      this.scene.add(panel);
      interactionManager.add(panel);
      this.panels.push(panel);
    }
  }


  // Function to check if a panel exists at a given position
  isPanelAtPosition(x: number, y: number, z: number): boolean {
    for (const panel of this.panels) {
      if (panel.position.x === x && panel.position.y === y && panel.position.z === z) {
        return true; // A panel with the same coordinates was found
      }
    }
    return false; // No panel found with the specified coordinates
  }

  // Function to handle changes in panel outlines visibility
  onPanelOutlinesChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const showOutlines = checkbox.checked;
    this.updatePanelOutlines(showOutlines);
  }

  // Function to update the visibility of panel outlines
  updatePanelOutlines(showOutlines: boolean) {
    this.showOutlines = showOutlines;
    this.panels.forEach(panel => {
      const isPanelTransparent = (panel.material as any).opacity === 0;
      const outline = panel.getObjectByName('outline');

      if (outline !== undefined) {
        outline.visible = showOutlines && isPanelTransparent;
      }
    });
  }
}
