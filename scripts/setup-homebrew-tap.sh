#!/bin/bash
# Run this once to create the homebrew tap repo
mkdir -p ../homebrew-agentx/Formula
cd ../homebrew-agentx

cat > README.md << 'EOF'
# homebrew-agentx
Homebrew tap for AgentX CLI.
brew tap SohailKhan0525/agentx
brew install agentx
EOF

cat > Formula/agentx.rb << 'EOF'
class Agentx < Formula
  desc "AI agent that builds production-ready websites from your terminal"
  homepage "https://github.com/SohailKhan0525/agentx-cli"
  url "https://registry.npmjs.org/@agent-qofeno/agentx-cli/-/agentx-cli-2.0.1.tgz"
  license "MIT"
  depends_on "node"
  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end
  test do
    system "#{bin}/agentx", "--version"
  end
end
EOF

git init
git add .
git commit -m "Initial homebrew tap for AgentX"
echo "Now create github.com/SohailKhan0525/homebrew-agentx and push to it"
