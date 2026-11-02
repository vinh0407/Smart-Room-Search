import liveHandler from '../live.js';

export const config = {
  runtime: 'edge',
};

export default function handler(request) {
  return liveHandler(request);
}
