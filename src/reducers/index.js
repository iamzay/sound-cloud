import { combineReducers } from 'redux';
import entities from './entities.js';
import player from './player.js';
import playlists from './playlists.js';

const rootReducer = combineReducers({ entities, player, playlists });

export default rootReducer;
