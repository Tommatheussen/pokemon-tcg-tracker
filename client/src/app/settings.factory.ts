export function settingsFactory(settingsStore) {
  return () => settingsStore.initSettings();
}