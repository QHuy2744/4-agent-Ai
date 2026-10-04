/**
 * Plugin System & Security Enforcer
 */
export class PluginSecurityManager {
  constructor() {
    this.plugins = new Map();
  }

  registerPlugin(manifest, code) {
    const allowedPermissions = ['filesystem.read', 'filesystem.write', 'storage.read', 'storage.write', 'network', 'ui', 'debug'];
    for (const p of manifest.permissions || []) {
      if (!allowedPermissions.includes(p)) {
        throw new Error(`Unauthorized permission requested: ${p}`);
      }
    }

    this.plugins.set(manifest.name, { manifest, code, active: true });
    return true;
  }

  verifyPermission(pluginName, permission) {
    const plugin = this.plugins.get(pluginName);
    if (!plugin || !plugin.active) return false;
    return plugin.manifest.permissions.includes(permission);
  }
}
