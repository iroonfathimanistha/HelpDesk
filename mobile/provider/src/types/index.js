export const REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  ON_THE_WAY: 'on_the_way',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export function getRequestStatusLabel(status) {
  const labels = {
    [REQUEST_STATUS.PENDING]: 'New request',
    [REQUEST_STATUS.ACCEPTED]: 'Accepted',
    [REQUEST_STATUS.ON_THE_WAY]: 'On the way',
    [REQUEST_STATUS.IN_PROGRESS]: 'In progress',
    [REQUEST_STATUS.COMPLETED]: 'Completed',
  };

  return labels[status] || String(status || 'Unknown').replaceAll('_', ' ');
}

export function getRequestUrgency(request) {
  return request.urgency || request.priority || 'Normal';
}

export function getRequestPhoto(request) {
  const candidate =
    request.photoUrl ||
    request.imageUrl ||
    request.photo ||
    (Array.isArray(request.photos) ? request.photos[0] : null);

  if (typeof candidate === 'string') return candidate;
  if (candidate && typeof candidate.url === 'string') return candidate.url;
  return null;
}
