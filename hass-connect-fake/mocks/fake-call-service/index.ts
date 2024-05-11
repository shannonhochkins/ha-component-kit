import { sceneUpdates } from "./scene";
import { climateUpdates } from "./climate";
import { lightUpdates } from './light';
import { mediaPlayerUpdates } from './mediaPlayer';
import { vacuumUpdates } from './vacuum';

export default {
  scene: sceneUpdates,
  climate: climateUpdates,
  light: lightUpdates,
  mediaPlayer: mediaPlayerUpdates,
  vacuum: vacuumUpdates,
}