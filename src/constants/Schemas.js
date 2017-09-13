import { normalize, schema } from 'normalizr';

const user = new schema.Entity('users');
const song = new schema.Entity('songs', {
  user: user
});
const songList = [song];
const userList = [user];
export {
  song as songSchema,
  songList as songListSchema,
  userList as userListSchema
};
