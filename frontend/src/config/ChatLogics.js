export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSender = (loggedUser, users) => {
  if (!loggedUser || !Array.isArray(users) || users.length === 0) return "";
  const [first, second] = users;
  if (!first || !second) return first?.name || second?.name || "";
  return first._id === loggedUser._id ? second.name : first.name;
};

export const getSenderFull = (loggedUser, users) => {
  if (!loggedUser || !Array.isArray(users) || users.length === 0) return loggedUser || null;
  const [first, second] = users;
  if (!first || !second) return first || second || null;
  return first._id === loggedUser._id ? second : first;
};



export const createdAt = (user) => {
const createdAt = new Date(user.createdAt);
const options = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
};

const formatter = new Intl.DateTimeFormat("en-IN", options);
const formattedDate = formatter.format(createdAt);
return formattedDate;
  
}
