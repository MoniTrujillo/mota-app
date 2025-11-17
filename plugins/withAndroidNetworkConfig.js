const {
  withAndroidManifest,
  withDangerousMod,
  AndroidConfig,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withAndroidNetworkConfig(config) {
  // Agregar configuración al manifest
  config = withAndroidManifest(config, (config) => {
    const { manifest } = config.modResults;

    // Añadir usesCleartextTraffic y networkSecurityConfig al application
    if (manifest.application && manifest.application[0]) {
      manifest.application[0].$["android:usesCleartextTraffic"] = "true";
      manifest.application[0].$["android:networkSecurityConfig"] =
        "@xml/network_security_config";
    }

    return config;
  });

  // Copiar archivo network_security_config.xml
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const sourceFile = path.join(
        projectRoot,
        "android",
        "app",
        "src",
        "main",
        "res",
        "xml",
        "network_security_config.xml"
      );
      const destDir = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "src",
        "main",
        "res",
        "xml"
      );
      const destFile = path.join(destDir, "network_security_config.xml");

      // Crear directorio si no existe
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      // Copiar archivo si existe en la fuente
      if (fs.existsSync(sourceFile)) {
        fs.copyFileSync(sourceFile, destFile);
      } else {
        // Crear el archivo si no existe
        const networkSecurityConfig = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </base-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">mota-uyjb.onrender.com</domain>
        <domain includeSubdomains="true">localhost</domain>
    </domain-config>
</network-security-config>`;

        fs.writeFileSync(destFile, networkSecurityConfig);
      }

      return config;
    },
  ]);

  return config;
};
