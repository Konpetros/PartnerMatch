export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const getDaysRemaining = (dateStr: string): number => {
  const deadline = new Date(dateStr);
  const today = new Date();
  const diff = deadline.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
