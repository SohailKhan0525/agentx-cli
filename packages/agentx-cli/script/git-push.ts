import { execSync } from "child_process"

try {
  console.log("Staging...")
  execSync("git add -A", { stdio: "inherit" })
  console.log("Committing...")
  execSync('git commit -m "feat(local-models): local model auto-setup dialog & v1.20.92 release"', { stdio: "inherit" })
  console.log("Tagging...")
  try {
    execSync("git tag -a v1.20.92 -m Release_v1.20.92", { stdio: "inherit" })
  } catch (e: any) {
    console.log("Tag note:", e.message)
  }
  console.log("Pushing main...")
  execSync("git push origin main", { stdio: "inherit" })
  console.log("Pushing tag...")
  execSync("git push origin v1.20.92", { stdio: "inherit" })
  console.log("Git push completed successfully!")
} catch (err: any) {
  console.error("Git error:", err.message)
}
