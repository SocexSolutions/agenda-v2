export const calcMaxLikes = (topics) => {
  return Math.floor(topics.length / 2);
};

export const calcUserLikes = (topics, user) => {
  return topics.reduce((acc, t) => {
    if (t.likes.includes(user.email)) {
      acc++;
    }

    return acc;
  }, 0);
};
