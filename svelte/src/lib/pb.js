import PocketBase from "pocketbase";

const pb = new PocketBase('http://127.0.0.1:8090');

// On the browser, load the auth from the cookie
if (typeof window !== 'undefined') {
  const match = document.cookie.match(/pb_auth=([^;]+)/);
  if (match) {
    pb.authStore.loadFromCookie(decodeURIComponent(match[1]));
  }
}

export default pb;
