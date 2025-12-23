import * as THREE from "three";

// UI rendering system - updates DOM via refs
export const setupUISystem = (gameState, uiRefs) => {
  return {
    updateHUD(speed, score, paperIntegrity) {
      if (uiRefs.current.speedBox)
        uiRefs.current.speedBox.innerText = (speed * 10).toFixed(1);
      if (uiRefs.current.scoreBox)
        uiRefs.current.scoreBox.innerText = score.toString();
      if (uiRefs.current.energyFill)
        uiRefs.current.energyFill.style.width =
          Math.max(0, paperIntegrity) + "%";
    },

    showIntro() {
      if (uiRefs.current.introScreen) {
        uiRefs.current.introScreen.style.opacity = "1";
        uiRefs.current.introScreen.style.pointerEvents = "auto";
      }
      if (uiRefs.current.hud) uiRefs.current.hud.style.opacity = "0";
    },

    hideIntro() {
      if (uiRefs.current.introScreen) {
        uiRefs.current.introScreen.style.opacity = "0";
        uiRefs.current.introScreen.style.pointerEvents = "none";
      }
      if (uiRefs.current.hud) uiRefs.current.hud.style.opacity = "1";
    },

    showPause() {
      if (uiRefs.current.pauseScreen) {
        uiRefs.current.pauseScreen.style.display = "flex";
      }
    },

    hidePause() {
      if (uiRefs.current.pauseScreen) {
        uiRefs.current.pauseScreen.style.display = "none";
      }
    },

    showGameOver() {
      if (uiRefs.current.thankYouScreen) {
        uiRefs.current.thankYouScreen.style.display = "flex";
        uiRefs.current.thankYouScreen.style.opacity = "1";
      }
    },

    hideGameOver() {
      if (uiRefs.current.thankYouScreen) {
        uiRefs.current.thankYouScreen.style.opacity = "0";
        uiRefs.current.thankYouScreen.style.display = "none";
      }
    },

    updateTurboStatus(ready) {
      if (uiRefs.current.turboStatus) {
        uiRefs.current.turboStatus.innerText = ready
          ? "TURBO READY"
          : "TURBO USED";
        uiRefs.current.turboStatus.className = ready
          ? "turbo-ready"
          : "turbo-used";
      }
    },

    showCountdown() {
      const el = uiRefs.current.countdown;
      if (el) el.style.opacity = "1";
    },

    hideCountdown() {
      const el = uiRefs.current.countdown;
      if (el) {
        el.innerText = "";
        el.style.opacity = "0";
      }
    },

    setCountdownNumber(num) {
      const el = uiRefs.current.countdown;
      if (el) el.innerText = num.toString();
    },

    showLoadingMessage() {
      if (uiRefs.current.loadingMsg)
        uiRefs.current.loadingMsg.style.display = "block";
    },

    hideLoadingMessage() {
      if (uiRefs.current.loadingMsg)
        uiRefs.current.loadingMsg.style.display = "none";
    },
  };
};
