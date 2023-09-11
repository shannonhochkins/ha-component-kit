import { sceneUpdates } from "./scene";
import { climateUpdates } from "./climate";
import { lightUpdates } from './light';
import { mediaPlayerUpdates } from './mediaPlayer';

export default {
  scene: sceneUpdates,
  climate: climateUpdates,
  light: lightUpdates,
  mediaPlayer: mediaPlayerUpdates,
}