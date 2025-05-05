import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { useGameStore } from '../stores/gameStore';
import { socketService } from '../services/socketService';

// Define asset paths
const ASSETS = {
  background: '/assets/room-background.png',
  player: '/assets/player.png',
  keypad: '/assets/keypad.png',
  lockbox: '/assets/lockbox.png',
  bookshelf: '/assets/bookshelf.png',
  door: '/assets/door.png',
  key: '/assets/key.png',
};

// Game object positions
const GAME_OBJECTS = {
  keypad: { x: 650, y: 250, width: 60, height: 80 },
  lockbox: { x: 200, y: 400, width: 100, height: 70 },
  bookshelf: { x: 450, y: 150, width: 120, height: 180 },
  door: { x: 400, y: 100, width: 80, height: 120 },
  key: { x: 150, y: 300, width: 30, height: 15 },
};

export function usePixiApp(containerRef: React.RefObject<HTMLDivElement>) {
  const [app, setApp] = useState<PIXI.Application | null>(null);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const gameObjectsRef = useRef<Map<string, PIXI.Sprite>>(new Map());
  const playerSpritesRef = useRef<Map<string, PIXI.Sprite>>(new Map());
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  
  const players = useGameStore(state => state.players);
  const playerId = useGameStore(state => state.playerId);
  const gameState = useGameStore(state => state.gameState);
  const inventory = useGameStore(state => state.inventory);
  const setActiveInteraction = useGameStore(state => state.setActiveInteraction);
  
  // Initialize Pixi application
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create PIXI application
    const pixiApp = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x1a1a1a,
      antialias: true,
    });
    
    // Add the canvas to the DOM
    containerRef.current.appendChild(pixiApp.view as unknown as Node);
    setApp(pixiApp);
    
    // Cleanup on unmount
    return () => {
      pixiApp.destroy(true, true);
      setApp(null);
    };
  }, [containerRef]);
  
  // Load game assets
  useEffect(() => {
    if (!app) return;
    
    // Create empty sprites as placeholders until assets load
    const placeholder = PIXI.Sprite.from(PIXI.Texture.WHITE);
    placeholder.width = 800;
    placeholder.height = 600;
    placeholder.tint = 0x333333;
    app.stage.addChild(placeholder);
    
    // Setup loading text
    const loadingText = new PIXI.Text('Loading assets...', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
    });
    loadingText.anchor.set(0.5);
    loadingText.position.set(app.screen.width / 2, app.screen.height / 2);
    app.stage.addChild(loadingText);
    
    // Load assets
    const loader = new PIXI.Loader();
    Object.values(ASSETS).forEach(asset => {
      loader.add(asset);
    });
    
    loader.load((loader, resources) => {
      // Remove placeholder and loading text
      app.stage.removeChild(placeholder);
      app.stage.removeChild(loadingText);
      
      // Setup the game scene
      setupGameScene(app, resources);
      setAssetsLoaded(true);
    });
    
    loader.onError.add((error) => {
      console.error('Error loading assets:', error);
      loadingText.text = 'Error loading assets. Please refresh.';
    });
    
  }, [app]);
  
  // Setup game scene with background, objects, and interactive elements
  const setupGameScene = (app: PIXI.Application, resources: any) => {
    // Create background
    const background = createBackground(app, resources);
    app.stage.addChild(background);
    
    // Create game objects container
    const gameObjectsContainer = new PIXI.Container();
    app.stage.addChild(gameObjectsContainer);
    
    // Create and add interactive game objects
    Object.entries(GAME_OBJECTS).forEach(([id, props]) => {
      const sprite = createInteractiveObject(id, props, resources);
      if (id === 'key') {
        // Key is initially visible, but will be removed when picked up
        sprite.visible = true;
      }
      gameObjectsContainer.addChild(sprite);
      gameObjectsRef.current.set(id, sprite);
    });
    
    // Create players container (on top of game objects)
    const playersContainer = new PIXI.Container();
    app.stage.addChild(playersContainer);
    
    // Setup interactivity
    setupInteractivity(app);
  };
  
  // Create the room background
  const createBackground = (app: PIXI.Application, resources: any) => {
    const background = PIXI.Sprite.from(PIXI.Texture.WHITE);
    background.width = app.screen.width;
    background.height = app.screen.height;
    background.tint = 0x1a1a1a; // Dark background as fallback
    
    // Overlay some grid or pattern for visual interest
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0x333333, 0.3);
    
    // Draw grid lines
    for (let x = 0; x < app.screen.width; x += 50) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, app.screen.height);
    }
    
    for (let y = 0; y < app.screen.height; y += 50) {
      graphics.moveTo(0, y);
      graphics.lineTo(app.screen.width, y);
    }
    
    background.addChild(graphics);
    return background;
  };
  
  // Create interactive game objects
  const createInteractiveObject = (id: string, props: any, resources: any) => {
    const texture = resources[ASSETS[id as keyof typeof ASSETS]]?.texture || PIXI.Texture.WHITE;
    const sprite = new PIXI.Sprite(texture);
    
    sprite.x = props.x;
    sprite.y = props.y;
    sprite.width = props.width;
    sprite.height = props.height;
    sprite.name = id;
    
    // Make the object interactive
    sprite.interactive = true;
    sprite.buttonMode = true;
    
    // Add hover effects
    sprite.on('pointerover', () => {
      sprite.alpha = 0.8;
      setHoveredObject(id);
    });
    
    sprite.on('pointerout', () => {
      sprite.alpha = 1;
      setHoveredObject(null);
    });
    
    // Add click handler
    sprite.on('pointerdown', () => {
      handleObjectInteraction(id);
    });
    
    return sprite;
  };
  
  // Handle interaction with game objects
  const handleObjectInteraction = (objectId: string) => {
    if (!gameState) return;
    
    // Set the active interaction for UI
    setActiveInteraction(objectId);
    
    if (objectId === 'key') {
      // Directly handle key pickup
      const roomId = useGameStore.getState().roomId;
      if (!roomId) return;
      
      socketService.interact({
        roomId,
        objectId: 'item',
        action: 'pickup',
        data: { itemId: 'key' }
      });
      
      // Hide the key in the scene
      const keySprite = gameObjectsRef.current.get('key');
      if (keySprite) {
        keySprite.visible = false;
      }
    }
  };
  
  // Setup general interactivity (player movement, etc.)
  const setupInteractivity = (app: PIXI.Application) => {
    // Make background interactable for player movement
    app.stage.interactive = true;
    app.stage.on('pointerdown', (event) => {
      const { x, y } = event.data.global;
      
      // Check if we clicked on an interactive object
      if (hoveredObject) return;
      
      // Otherwise, move the player
      if (playerId) {
        socketService.updatePosition({ x, y });
      }
    });
  };
  
  // Update player sprites based on players in the store
  useEffect(() => {
    if (!app || !assetsLoaded) return;
    
    // Create or update player sprites
    players.forEach((player) => {
      let playerSprite = playerSpritesRef.current.get(player.id);
      
      if (!playerSprite) {
        // Create new player sprite
        playerSprite = new PIXI.Container();
        
        // Avatar background (colored circle)
        const avatarBg = new PIXI.Graphics();
        avatarBg.beginFill(parseInt(player.avatarColor.replace('#', '0x')));
        avatarBg.drawCircle(0, 0, 20);
        avatarBg.endFill();
        playerSprite.addChild(avatarBg);
        
        // Name text
        const nameText = new PIXI.Text(player.name, {
          fontFamily: 'Arial',
          fontSize: 12,
          fill: 0xffffff,
          align: 'center',
        });
        nameText.anchor.set(0.5, 0);
        nameText.position.set(0, 25);
        playerSprite.addChild(nameText);
        
        // Add to stage
        app.stage.addChild(playerSprite);
        playerSpritesRef.current.set(player.id, playerSprite);
      }
      
      // Update player position
      playerSprite.position.set(player.position.x, player.position.y);
      
      // Highlight the local player
      if (player.id === playerId) {
        const child = playerSprite.getChildAt(0) as PIXI.Graphics;
        child.clear();
        child.lineStyle(2, 0xffffff);
        child.beginFill(parseInt(player.avatarColor.replace('#', '0x')));
        child.drawCircle(0, 0, 20);
        child.endFill();
      }
    });
    
    // Remove disconnected players
    playerSpritesRef.current.forEach((sprite, id) => {
      if (!players.has(id)) {
        app.stage.removeChild(sprite);
        playerSpritesRef.current.delete(id);
      }
    });
  }, [app, players, playerId, assetsLoaded]);
  
  // Update game objects based on game state
  useEffect(() => {
    if (!app || !gameState || !assetsLoaded) return;
    
    // Update puzzle objects based on solved state
    Object.entries(gameState.puzzles).forEach(([puzzleId, puzzle]) => {
      const sprite = gameObjectsRef.current.get(puzzleId);
      if (!sprite) return;
      
      if (puzzle.solved) {
        // Visual indication that puzzle is solved
        sprite.tint = 0x00ff00; // Green tint
      } else {
        sprite.tint = 0xffffff; // Normal tint
      }
    });
    
    // Handle key visibility based on inventory
    const keySprite = gameObjectsRef.current.get('key');
    if (keySprite) {
      keySprite.visible = !inventory.includes('key');
    }
  }, [app, gameState, inventory, assetsLoaded]);
  
  return { app, hoveredObject };
}