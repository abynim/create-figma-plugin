import { globby } from 'globby'
import ncu from 'npm-check-updates'
import { Index, PackageFile } from 'npm-check-updates/build/src/types'
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function main(): Promise<void> {
  try {
    const parentDirectoryPath = resolve(__dirname, '..')
    const globPatterns = [
      join(parentDirectoryPath, 'package.json'),
      join(parentDirectoryPath, 'packages', '**', 'package.json')
    ]
    await bumpDependencies(globPatterns)
  } catch (error: any) {
    console.error(error.message) // eslint-disable-line no-console
    process.exit(1)
  }
}
main()

async function bumpDependencies(globPatterns: Array<string>): Promise<void> {
  const args = process.argv.slice(2) // Modules passed in as CLI arguments will _not_ be bumped
  const packageJsonFilePaths = await globby(globPatterns, {
    deep: 2
  })
  const promises: Array<Promise<void | PackageFile | Index<string>>> = []
  for (const filePath of packageJsonFilePaths) {
    promises.push(
      ncu({
        packageFile: filePath,
        packageManager: 'npm',
        reject: args,
        silent: false,
        target: 'latest',
        upgrade: true
      })
    )
  }
  await Promise.all(promises)
}
main()
