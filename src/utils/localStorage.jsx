export const saveData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getData = (key) => {
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Storage parse error:", err);
    return [];
  }
};

export const deleteData = (key, id) => {
  const list = getData(key);
  const filtered = list.filter((item) => item.id !== id);
  saveData(key, filtered);
};
