import { normalize, schema } from 'normalizr';

const user = new schema.Entity('users');
const song = new schema.Entity('songs', {
  user: user
});
const songList = [song];

export { song as songSchema, songList as songListSchema };
