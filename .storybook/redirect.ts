

export function redirectToStory(pathQueryString: string) {
  if (window.top) {
    // with the window top location, we need to update the `path` query string value (if present) and then redirect to this new url
    const url = new URL(window.top.location.href);
    url.searchParams.set('path', pathQueryString);
    window.top.location.href = url.toString();
  }
}