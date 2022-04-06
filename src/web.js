import fetch from "node-fetch";

export const userAction = async () => {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    const data = await response.json();
    return data;
  } catch {
    console.error(err);
  }
};
