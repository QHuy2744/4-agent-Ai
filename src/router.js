export const router = {
  navigate(route) {
    window.location.hash = route;
  },
  getCurrentRoute() {
    return window.location.hash.slice(1) || 'desktop';
  }
};