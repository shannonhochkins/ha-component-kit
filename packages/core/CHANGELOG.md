# @hakit/core

## 6.1.0

- Add `useDishwasher`: explicit typed entity roles, native entity services, normalized operation/door states, reported program/metric/permission data, and Recorder-backed cycle/door-access evidence. State mappings support other integrations. Missing or uncertain history remains unknown; opening the door does not prove unloading.
- Ordinary native, `useService`, and entity-service calls now await acknowledgement without requesting service response data. Explicit `returnResponse: true` retains typed responses. Disconnected calls and transport errors reject.
- Expose the full native entity registry where authorized, with display-registry fallback and session cleanup. Add the pure `@hakit/core/registry` disabled-state helper.
- Correct the CommonJS package boundary and external default-import interoperability so the published require entry can load.
- Expose `useHistory` failures and clean up subscriptions that finish opening after unmount.

Validation uses synthetic entities and mocked HA transport. No physical appliance operation or full live dishwasher cycle is claimed.
