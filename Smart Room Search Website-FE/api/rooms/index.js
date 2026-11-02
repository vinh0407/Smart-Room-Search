import handler from './live.js';

export default async function roomsIndex(req, res) {
  return handler(req, res);
}
