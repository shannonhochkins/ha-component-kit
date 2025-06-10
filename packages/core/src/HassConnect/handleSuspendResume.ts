import { Connection } from "home-assistant-js-websocket";

export type ConnectionStatus = "pending" | "disconnected" | "pending-suspension" | "suspended" | "connected";

export interface HandleSuspendResumeOptions {
  /** - suspendWhenHidden: if false, never tear down the connection even when the page is hidden. @default true  */
  suspendWhenHidden?: boolean;
  /** hiddenDelayMs: how long (in milliseconds) to wait after "hidden" before calling connection.suspend(), defaults to 5 minutes (300000 ms). @default 300000 */
  hiddenDelayMs?: number;
  /** debug: if true, logs all visibility/freeze/resume steps to the console. @default false */
  debug?: boolean;
  /**
   * Optional callback that will be called whenever the connection status changes.
   * The argument is one of:
   *   - "pending-suspension": right after suspendReconnectUntil() is called
   *   - "suspended": when the socket is actually suspended via connection.suspend()
   *   - "connected": when the pending suspension is lifted (i.e. reconnection may resume)
   */
  onStatusChange?: (status: ConnectionStatus) => void;
}

/**
 * Attaches listeners to document for:
 *  - visibilitychange (desktop)
 *  - freeze / resume (mobile/Cordova/etc)
 * to “pause” (suspendReconnectUntil + suspend) when the page is hidden/frozen, and “resume” when it becomes visible/resumes.
 *
 * @param connection - connection object from home-assistant-js-websocket
 * @param options - ptional settings (delay, whether to suspend, debug, status callback)
 * @returns a cleanup function that removes all listeners and clears any pending timeouts
 */
export function handleSuspendResume(connection: Connection, options: HandleSuspendResumeOptions = {}): () => void {
  const {
    suspendWhenHidden = true,
    hiddenDelayMs = 300_000, // default 5 minutes
    debug = false,
    onStatusChange,
  } = options;

  // If hiddenDelayMs is 0, suspension happens immediately; otherwise wait that many ms.
  const DELAY_MS = hiddenDelayMs;

  /**
   * If non-null, we have a pending “resume” promise’s resolve function.
   * Once invoked, we lift the suspension.
   */
  let pendingResolve: (() => void) | null = null;

  /**
   * ID of the timeout that will eventually call connection.suspend().
   * Cleared if the user returns early.
   */
  let hiddenTimeoutId: number | null = null;

  /**
   * True if we’ve already called suspendReconnectUntil(...) and not yet resolved it.
   * Prevents stacking multiple promises.
   */
  let isSuspended = false;

  if (connection.connected) {
    if (debug) console.log("[SR] Connection is already active → handleSuspendResume will manage suspension");
    onStatusChange?.("connected");
  } else {
    if (debug) console.log("[SR] Connection is not active");
    onStatusChange?.("disconnected");
  }

  // helper: when the page/tab goes hidden (or “freeze” fires)
  function onHidden() {
    if (debug) console.log("[SR] onHidden() triggered");

    // If the user disabled suspension or we’re already suspended, do nothing.
    if (!suspendWhenHidden) {
      if (debug) console.log("[SR] suspendWhenHidden is false → skipping suspension");
      return;
    }
    if (isSuspended) {
      if (debug) console.log("[SR] Already suspended → skipping duplicate suspension");
      return;
    }

    isSuspended = true;

    // Create a fresh “resumePromise”
    const resumePromise = new Promise<void>((resolve) => {
      pendingResolve = () => {
        if (debug) console.log("[SR] pendingResolve() called → lifting suspension");
        isSuspended = false;
        pendingResolve = null;
        resolve();
        onStatusChange?.("connected");
      };
    });

    if (debug) console.log("[SR] Calling connection.suspendReconnectUntil(...)");
    onStatusChange?.("pending-suspension");
    connection.suspendReconnectUntil(resumePromise);

    // Wait DELAY_MS before actually closing the socket.
    if (debug) console.log(`[SR] Starting hidden delay of ${DELAY_MS}ms before actual suspend()`);
    hiddenTimeoutId = window.setTimeout(() => {
      hiddenTimeoutId = null;
      // If still hidden, suspend the connection:
      if (document.hidden) {
        if (debug) console.log("[SR] Hidden timeout elapsed → calling suspend()");
        suspend();
      } else {
        // User returned before timeout. Resolve immediately.
        if (pendingResolve) {
          if (debug) console.log("[SR] Hidden timeout elapsed but page is visible → resolving pendingResolve()");
          // potentially unreachable, but just in case!
          pendingResolve();
        }
      }
    }, DELAY_MS);

    // If the user focuses before DELAY_MS is up, resume immediately:
    window.addEventListener("focus", onVisibleOrResume, { once: true });
  }

  // helper when page/tab becomes visible or “resume” fires after freeze
  function onVisibleOrResume() {
    if (debug) console.log("[SR] onVisibleOrResume() fired (page became visible)");

    // If we still have a pending hiddenTimeout, clear it:
    if (hiddenTimeoutId !== null) {
      clearTimeout(hiddenTimeoutId);
      hiddenTimeoutId = null;
      if (debug) console.log("[SR] Cleared hiddenTimeoutId (user returned before allotted time)");
    }

    // If there’s a pending “resume” promise, resolve it:
    if (pendingResolve) {
      if (debug) console.log("[SR] Resolving pendingResolve() on actual resume");
      // resets isSuspended and pendingResolve itself
      pendingResolve();
    }
  }

  // helpers for the event listeners to attach
  function visibilityChangeHandler() {
    if (document.hidden) {
      if (debug) console.log("[SR] visibilitychange → HIDDEN");
      onHidden();
    } else {
      if (debug) console.log("[SR] visibilitychange → VISIBLE");
      onVisibleOrResume();
    }
  }

  function resumeHandler() {
    if (debug) console.log("[SR] resume event fired");
    onVisibleOrResume();
  }

  function suspend() {
    if (!connection.connected) {
      if (debug) console.log("[SR] Connection already suspended → skipping suspend()");
      return;
    }
    onStatusChange?.("suspended");
    if (debug) console.log("[SR] suspend() called → suspending connection");
    window.stop();
    connection.suspend();
  }

  // wire in event handlers
  document.addEventListener("visibilitychange", visibilityChangeHandler, false);
  document.addEventListener("freeze", suspend);
  document.addEventListener("resume", resumeHandler);

  if (debug) console.log("[SR] handleSuspendResume() initialized; debugging is ON");

  // return the cleanup function that removes all listeners and clears timeouts
  return () => {
    if (debug) console.log("[SR] cleanup() called → removing listeners & clearing timeouts");

    document.removeEventListener("visibilitychange", visibilityChangeHandler, false);
    document.removeEventListener("freeze", suspend);
    document.removeEventListener("resume", resumeHandler);
    window.removeEventListener("focus", onVisibleOrResume);

    if (hiddenTimeoutId !== null) {
      if (debug) console.log("[SR] cleanup: Clearing hiddenTimeoutId");
      clearTimeout(hiddenTimeoutId);
      hiddenTimeoutId = null;
    }
    // If there’s still a pendingResolve (Promise not resolved), resolve it now so reconnection can recover:
    if (pendingResolve) {
      if (debug) console.log("[SR] cleanup: Resolving pendingResolve() to let reconnection proceed");
      pendingResolve();
      pendingResolve = null;
      isSuspended = false;
    }
  };
}
