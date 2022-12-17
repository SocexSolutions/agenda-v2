export function getMeetingLinks(meeting) {
  const links = {};

  if (meeting) {
    const meeting_id = meeting._id;

    links.meet = `/meeting/${meeting_id}/meet`;
    links.vote = `/meeting/${meeting_id}/vote`;
    links.edit = `/meeting/${meeting_id}/edit`;
  }

  return links;
}
