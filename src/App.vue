<script setup lang="ts">
// import Phaser from 'phaser';
import { ref } from 'vue';
// import type { MainMenu } from './game/scenes/MainMenu';
import PhaserGame from './PhaserGame.vue';
import { VueScene } from '@scenes/VueScene';
import CardBattleApiSocketIO from './game/api/CardBattleApiSocketIo';

// The sprite can only be moved in the MainMenu Scene
// const canMoveSprite = ref();

//  References to the PhaserGame component (game and scene are exposed)
const phaserRef = ref();
// const spritePosition = ref({ x: 0, y: 0 });

// Event emitted from the PhaserGame component
const currentScene = (scene: VueScene) => {
    const api = new CardBattleApiSocketIO();
    scene.setApi(api);
}

</script>

<template>
    <PhaserGame ref="phaserRef" @current-active-scene="currentScene" />
    <!-- <div>
        <div>
            <button class="button" @click="changeScene">Change Scene</button>
        </div>
        <div>
            <button :disabled="canMoveSprite" class="button" @click="moveSprite">Toggle Movement</button>
        </div>
        <div class="spritePosition">Sprite Position:
            <pre>{{ spritePosition }}</pre>
        </div>
        <div>
            <button class="button" @click="addSprite">Add New Sprite</button>
        </div>
    </div> -->
</template>
