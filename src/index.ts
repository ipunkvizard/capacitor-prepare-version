import path from 'node:path'
import process from 'node:process'
import fse from 'fs-extra'

interface CommandOptions {
  version?: string
}

interface AppVersion {
  version: string
  buildNumber: number
}

interface PackageVersion {
  major: string
  minor: string
  build: string
}

function getAppVersion(options: CommandOptions): AppVersion {
  const versionPath = path.join(process.cwd(), 'version.json')
  const packageVersion = _getPackageVersion()
  const currentVersion = _getVersionJson(versionPath)
  const buildNumber = options?.version || _createBuildNumber(currentVersion)
  const nextVersion = {
    version: `${packageVersion.major}.${packageVersion.minor}.${buildNumber}`,
    buildNumber: Number.parseInt(buildNumber),
  }

  _setVersionJson(versionPath, nextVersion)

  return nextVersion
}

function _createBuildDate(): string {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2)
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const date = now.getDate().toString().padStart(2, '0')

  return `${year}${month}${date}`
}

function _createBuildNumber(currentVersion: AppVersion): string {
  const oldBuildDate = _getBuildDate(currentVersion.buildNumber)
  const oldRevisionNumber = _getBuildRevision(currentVersion.buildNumber)
  const newBuildDate = _createBuildDate()
  const newRevisionNumber = oldBuildDate !== newBuildDate ? 1 : oldRevisionNumber + 1

  return `${newBuildDate}${newRevisionNumber}`
}

function _getBuildDate(buildNumber: number): string {
  return `${buildNumber}`.slice(0, 6)
}

function _getBuildRevision(buildNumber: number): number {
  return Number.parseInt(`${buildNumber}`.slice(6))
}

function _getPackageVersion(): PackageVersion {
  const packagePath = path.join(process.cwd(), 'package.json')
  const packageJson = JSON.parse(fse.readFileSync(packagePath, 'utf8'))
  const [major, minor, build] = packageJson.version.split('.')

  return {
    major: `${major}`,
    minor: `${minor}`,
    build: `${build}`,
  }
}

function _getVersionJson(jsonPath: string): AppVersion {
  if (fse.existsSync(jsonPath)) {
    return JSON.parse(fse.readFileSync(jsonPath, 'utf8'))
  }
  else {
    const packageVersion = _getPackageVersion()
    const buildDate = _createBuildDate()
    const revisionNumber = 0
    const buildNumber = `${buildDate}${revisionNumber}`

    return {
      version: `${packageVersion.major}.${packageVersion.minor}.${buildNumber}`,
      buildNumber: Number.parseInt(buildNumber),
    }
  }
}

function _setVersionJson(jsonPath: string, json: AppVersion) {
  fse.writeFileSync(jsonPath, JSON.stringify(json, null, 2))
}

module.exports = {
  getAppVersion,
}
