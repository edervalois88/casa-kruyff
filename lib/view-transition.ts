export function transitionView(update: () => void | Promise<void>) {
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    void update();
    return;
  }
  const transition = document.startViewTransition(update);
  // A newer interaction or a hidden tab can skip a visual snapshot; the update still runs.
  void transition.ready.catch(() => {});
  void transition.finished.catch(() => {});
}
