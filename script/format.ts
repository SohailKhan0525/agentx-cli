#!/usr/bin/env node

import { execSync } from "node:child_process"

execSync("npx prettier --ignore-unknown --write .", { stdio: "inherit" })
