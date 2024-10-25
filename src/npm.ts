import { join } from "jsr:@std/path";
import type { DenoConfigType } from "./types.ts";

export async function migrateNpmScripts({
  workingDirectory,
  existingDenoConfig,
}: {
  workingDirectory: string;
  existingDenoConfig: DenoConfigType;
}) {
  try {
    const packageJsonPath = join(workingDirectory, "package.json");
    const pkgJson = JSON.parse(await Deno.readTextFile(packageJsonPath));

    return {
      ...existingDenoConfig,
      tasks: {
        ...(existingDenoConfig.tasks || {}),
        ...(pkgJson.scripts || {}),
      },
    } as DenoConfigType;
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error migrating scripts:", error.message);
    } else {
      console.error("❌ Error migrating scripts:", error);
    }

    return existingDenoConfig;
  }
}
