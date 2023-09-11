import type { ServiceArgs } from './types';

const tracks = (now: string) => ({
  first: {
    attributes: {
      media_duration: 219,
      media_position: 1.819,
      media_position_updated_at: now,
      media_title: "My Way",
      media_artist: "Calvin Harris",
      app_name: "YouTube Music",
      entity_picture: "https://lh3.googleusercontent.com/sLxiYvk82ZBXIYW-g_qh4BDjkApX4gdRvGxeinQIC0HBwte4AKOzS3u2mDPaYjPBw6dD_Of-r0x10egf=w544-h544-l90-rj",
    },
    context: {
      id: "1",
      user_id: null,
      parent_id: null,
    },
  },
  second: {
    attributes: {
      media_duration: 199,
      media_position: 1.005,
      media_position_updated_at: now,
      media_title: "Human",
      media_artist: "Rag'n'Bone Man",
      media_album_name: "Human",
      app_name: "YouTube",
      entity_picture: "https://lh3.googleusercontent.com/dtJNjutgMCLfu4FemGp9xilUjGTrWo8eOzIzFQz97IEQaqB2NMWTarj1Sh2fuRNnlmfY8B-jrWm-nmuP=w544-h544-l90-rj",
    },
    context: {
      id: "2",
      user_id: null,
      parent_id: null,
    },
  }
});

export function mediaPlayerUpdates({
  now,
  target: _target,
  service,
  serviceData,
  setEntities,
}: ServiceArgs<'mediaPlayer'>) {
  const dates = {
    last_changed: now,
    last_updated: now,
  }
  if (typeof _target === 'string') return true;
  console.log('service', service);
  const [target] = _target;
  switch (service) {
    case 'mediaPlay':
      return setEntities(entities => ({
        ...entities,
        [target]: {
          ...entities[target],
          ...dates,
          state: 'playing'
        }
      }));
    case 'mediaPause':
      return setEntities(entities => ({
        ...entities,
        [target]: {
          ...entities[target],
          ...dates,
          state: 'paused'
        }
      }));
    case 'mediaPreviousTrack':
    case 'mediaNextTrack': {
      return setEntities(entities => {
        const entity = entities[target];
        const id = entity.context.id;
        const next = id === '1' ? 'second' : 'first';
        return {
          ...entities,
          [target]: {
            ...entities[target],
            ...tracks(now)[next],
            ...dates,
            attributes: {
              ...entities[target].attributes,
              ...tracks(now)[next].attributes,
            }
          }
        }
      });
    }
    case 'volumeSet':
    case 'volumeMute':
      return setEntities(entities => ({
        ...entities,
        [target]: {
          ...entities[target],
          ...dates,
          attributes: {
            ...entities[target].attributes,
            ...serviceData ?? {},
          }
        }
      }));
    case 'volumeUp':
    case 'volumeDown':
      return setEntities(entities => ({
        ...entities,
        [target]: {
          ...entities[target],
          ...dates,
          attributes: {
            ...entities[target].attributes,
            volume_level: entities[target].attributes.volume_level + (service === 'volumeUp' ? 0.1 : -0.1),
          }
        }
      }));
  }
  return true;
}